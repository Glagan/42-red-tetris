# Shared
FROM node:16-alpine3.15 as base

RUN yarn set version berry

WORKDIR /app
COPY ./package.json .
COPY ./yarn.lock .
COPY ./.yarnrc.yml .

COPY --chown=node:node . .

RUN yarn install

# Development
FROM node:16-alpine3.15 as development

RUN apk add dumb-init

WORKDIR /app
COPY --chown=node:node --from=base /app .

ENTRYPOINT dumb-init yarn run dev --host

# Production
FROM node:16-alpine3.15 as production

RUN apk add dumb-init

WORKDIR /app
COPY --chown=node:node --from=base /app .

RUN yarn run build

ENTRYPOINT dumb-init node ./server.js
