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

# Pasta do log das chamadas à IA (volume partilhado com o painel de monitorização)
RUN mkdir -p /logs/ai && chown node:node /logs/ai

USER node

EXPOSE 3000

CMD ["npm", "start"]