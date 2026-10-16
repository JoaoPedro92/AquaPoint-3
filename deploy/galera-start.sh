#!/bin/bash
# Decide se este nó cria o cluster ou se junta a um que já existe.
# Só o db1 (GALERA_BOOTSTRAP=1) pode criar o cluster; o db2 junta-se sempre.
set -e

DATADIR=/var/lib/mysql
EXTRA_ARGS=()

peer_up() {
  timeout 2 bash -c "</dev/tcp/${GALERA_PEER}/4567" 2>/dev/null
}

if [ "$GALERA_BOOTSTRAP" = "1" ]; then
  if [ ! -d "$DATADIR/mysql" ]; then
    echo "[galera] Primeiro arranque: a criar o cluster e a importar o backup.sql"
    EXTRA_ARGS+=(--wsrep-cluster-address=gcomm://)
  elif peer_up; then
    echo "[galera] ${GALERA_PEER} está ativo: a juntar ao cluster"
  else
    echo "[galera] ${GALERA_PEER} não responde: a recriar o cluster a partir deste nó"
    if [ -f "$DATADIR/grastate.dat" ]; then
      sed -i 's/^safe_to_bootstrap: 0/safe_to_bootstrap: 1/' "$DATADIR/grastate.dat"
      chown mysql:mysql "$DATADIR/grastate.dat"
    fi
    EXTRA_ARGS+=(--wsrep-cluster-address=gcomm://)
  fi
else
  echo "[galera] A juntar ao cluster através de ${GALERA_PEER}"
fi

exec docker-entrypoint.sh mariadbd "${EXTRA_ARGS[@]}"
