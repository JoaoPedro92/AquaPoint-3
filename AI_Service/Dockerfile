# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.21.0

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

COPY --chown=node:node . .

USER node

# gRPC (só acessível dentro da rede do Docker)
EXPOSE 50051

# Chama o RPC Health: o container fica "healthy" quando o modelo está carregado
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
    CMD ["node", "src/healthcheck.js"]

CMD ["node", "src/server.js"]
