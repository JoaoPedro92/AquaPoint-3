# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.21.0

# =========================
# Build
# =========================
FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /usr/src/app

ENV NODE_ENV=developement

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# =========================
# Production
# =========================
FROM nginx:alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]