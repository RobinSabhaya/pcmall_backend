FROM node:alpine

RUN mkdir -p /usr/src/pcmall_backend && chown -R node:node /usr/src/pcmall_backend

WORKDIR /usr/src/pcmall_backend

COPY package.json yarn.lock ./

USER node

RUN yarn

COPY --chown=node:node . .

EXPOSE 3000
