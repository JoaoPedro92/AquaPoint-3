// Realtime Socket.IO


import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

let io = null;

export async function initRealtime(httpServer) {
  io = new Server(httpServer, {
    // O frontend é servido pelo mesmo endereço (via Nginx), mas em dev o Vite
    // corre noutra porta; tal como o resto da API, aceitamos qualquer origem.
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`[socket] ligado ${socket.id}`);
    socket.on("disconnect", () => console.log(`[socket] desligado ${socket.id}`));
  });

  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    try {
      // São precisos dois clientes: um para publicar e outro para subscrever
      // (um cliente Redis em modo "subscribe" não pode fazer mais nada).
      const pubClient = createClient({ url: redisUrl });
      const subClient = pubClient.duplicate();
      pubClient.on("error", (err) => console.error("[redis]", err.message));
      subClient.on("error", (err) => console.error("[redis]", err.message));
      await Promise.all([pubClient.connect(), subClient.connect()]);
      io.adapter(createAdapter(pubClient, subClient));
      console.log(`[socket] Redis adapter ativo (${redisUrl})`);
    } catch (err) {
      console.error("[socket] Redis indisponível, a emitir só nesta réplica:", err.message);
    }
  }

  return io;
}

// Chamado pelo controller depois do INSERT.
// Se o Socket.IO não estiver iniciado (ex.: testes), não faz nada.
export function emitNewAquapoint(point) {
  if (!io) return;
  io.emit("bebedouro:novo", point);
}
