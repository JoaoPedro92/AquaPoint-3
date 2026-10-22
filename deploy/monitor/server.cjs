// Monitor do AquaPoint: lê os logs do proxy, o estado dos containers (Docker)
// e o estado do cluster Galera, e serve um painel em http://localhost:8081
const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const PORT = 4000;
const LOG_FILE = '/logs/access.json';
const PROJECT = process.env.COMPOSE_PROJECT || 'aquapoint';
const ROOT_PW = process.env.DB_ROOT_PASSWORD;
const DB_NODES = (process.env.DB_NODES || 'db1,db2').split(',');
const PROTECTED = ['proxy', 'monitor']; // não se podem parar pelo painel

// ---------- Docker (através do socket) ----------
function docker(method, apiPath) {
  return new Promise((resolve, reject) => {
    const req = http.request({ socketPath: '/var/run/docker.sock', path: apiPath, method }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        if (res.statusCode >= 400) return reject(new Error(`Docker respondeu ${res.statusCode}: ${data}`));
        try { resolve(data ? JSON.parse(data) : null); } catch { resolve(null); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function getContainers() {
  const filters = encodeURIComponent(JSON.stringify({ label: [`com.docker.compose.project=${PROJECT}`] }));
  const list = await docker('GET', `/containers/json?all=1&filters=${filters}`);
  return list
    .map((c) => {
      const nets = Object.values((c.NetworkSettings && c.NetworkSettings.Networks) || {});
      const service = c.Labels['com.docker.compose.service'];
      const health = (c.Status.match(/\((healthy|unhealthy|health: starting)\)/) || [])[1] || null;
      return {
        id: c.Id,
        name: c.Names[0].replace(/^\//, ''),
        service,
        replica: Number(c.Labels['com.docker.compose.container-number'] || 1),
        state: c.State,
        status: c.Status,
        health,
        ip: (nets[0] && nets[0].IPAddress) || null,
        protected: PROTECTED.includes(service),
      };
    })
    .sort((a, b) => a.service.localeCompare(b.service) || a.replica - b.replica);
}

// ---------- Logs do nginx ----------
function readRecentLog(maxBytes = 1024 * 1024) {
  try {
    const { size } = fs.statSync(LOG_FILE);
    const start = Math.max(0, size - maxBytes);
    const fd = fs.openSync(LOG_FILE, 'r');
    const buf = Buffer.alloc(size - start);
    fs.readSync(fd, buf, 0, buf.length, start);
    fs.closeSync(fd);
    const lines = buf.toString('utf8').split('\n');
    if (start > 0) lines.shift(); // primeira linha pode estar cortada
    return lines.filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  } catch {
    return [];
  }
}

// ---------- Galera ----------
// Uma pool por nó, reutilizada entre atualizações (evita abrir uma ligação nova a cada 2 s)
const pools = {};
function poolFor(node) {
  if (!pools[node]) {
    pools[node] = mysql.createPool({
      host: node, user: 'root', password: ROOT_PW,
      connectTimeout: 5000, connectionLimit: 1, waitForConnections: true, queueLimit: 1,
    });
  }
  return pools[node];
}

async function galeraNode(node) {
  const started = Date.now();
  try {
    const [rows] = await poolFor(node).query({
      sql: "SHOW GLOBAL STATUS WHERE Variable_name IN ('wsrep_cluster_size','wsrep_local_state_comment','wsrep_cluster_status','Threads_connected')",
      timeout: 4000,
    });
    const s = Object.fromEntries(rows.map((r) => [r.Variable_name, r.Value]));
    return {
      node,
      online: true,
      clusterSize: Number(s.wsrep_cluster_size),
      state: s.wsrep_local_state_comment,
      clusterStatus: s.wsrep_cluster_status,
      connections: Math.max(0, Number(s.Threads_connected) - 1), // sem contar o próprio monitor
      ms: Date.now() - started,
    };
  } catch (e) {
    // Descarta a pool para tentar de raiz na próxima atualização
    if (pools[node]) { pools[node].end().catch(() => {}); delete pools[node]; }
    console.error(`[monitor] ${node}: ${e.code || ''} ${e.message} (${Date.now() - started} ms)`);
    return { node, online: false, error: e.code || e.message };
  }
}

// ---------- Estatísticas ----------
async function buildStats() {
  const [containers, db] = await Promise.all([
    getContainers().catch((e) => ({ error: e.message })),
    Promise.all(DB_NODES.map(galeraNode)),
  ]);

  const ipToName = {};
  if (Array.isArray(containers)) containers.forEach((c) => { if (c.ip) ipToName[c.ip] = c.name; });

  const now = Date.now() / 1000;
  const entries = readRecentLog().filter((e) => e.uri !== '/nginx-status');
  const lastMinute = entries.filter((e) => now - e.t <= 60);

  const replicaOf = (e) => {
    const last = String(e.upstream || '').split(',').pop().trim(); // após nova tentativa fica o último
    const ip = last.split(':')[0];
    return ipToName[ip] || last || null;
  };

  const perReplica = {};
  lastMinute.forEach((e) => { const r = replicaOf(e); if (r) perReplica[r] = (perReplica[r] || 0) + 1; });

  const statusGroups = { '2xx': 0, '3xx': 0, '4xx': 0, '5xx': 0 };
  entries.forEach((e) => { const g = `${String(e.status)[0]}xx`; if (g in statusGroups) statusGroups[g]++; });

  const avg = (arr) => (arr.length ? arr.reduce((s, e) => s + Number(e.rt || 0), 0) / arr.length : 0);

  return {
    generatedAt: new Date().toISOString(),
    containers: Array.isArray(containers) ? containers : [],
    dockerError: Array.isArray(containers) ? null : containers.error,
    db,
    totals: {
      logged: entries.length,
      lastMinute: lastMinute.length,
      errorsLastMinute: lastMinute.filter((e) => e.status >= 500).length,
      avgTimeLastMinute: avg(lastMinute),
    },
    perReplica,
    statusGroups,
    recent: entries.slice(-40).reverse().map((e) => ({
      t: e.t, method: e.method, uri: e.uri, status: e.status, rt: e.rt, replica: replicaOf(e),
    })),
  };
}

// ---------- Servidor HTTP ----------
function send(res, code, body, type = 'application/json; charset=utf-8') {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}

http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
      return send(res, 200, fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8'), 'text/html; charset=utf-8');
    }
    if (req.method === 'GET' && req.url === '/api/stats') {
      return send(res, 200, await buildStats());
    }
    const action = req.url.match(/^\/api\/containers\/([a-f0-9]+)\/(start|stop|restart)$/);
    if (req.method === 'POST' && action) {
      const [, id, verb] = action;
      const target = (await getContainers()).find((c) => c.id === id);
      if (!target) return send(res, 404, { error: 'Container não encontrado.' });
      if (target.protected) return send(res, 403, { error: `O ${target.service} não pode ser parado pelo painel.` });
      await docker('POST', `/containers/${id}/${verb}?t=5`);
      return send(res, 200, { ok: true });
    }
    if (req.method === 'POST' && req.url === '/api/logs/clear') {
      fs.truncateSync(LOG_FILE, 0);
      return send(res, 200, { ok: true });
    }
    send(res, 404, { error: 'Não encontrado.' });
  } catch (e) {
    send(res, 500, { error: e.message });
  }
}).listen(PORT, () => console.log(`Monitor a correr na porta ${PORT}`));
