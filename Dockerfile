FROM node:18-alpine

RUN apk add --no-cache make gcc g++ python3

RUN mkdir -p /usr/src/pcmall_backend && chown -R node:node /usr/src/pcmall_backend

WORKDIR /usr/src/pcmall_backend

COPY package.json yarn.lock ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000