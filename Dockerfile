FROM node:18-alpine

# Install build dependencies if needed
RUN apk add --no-cache make gcc g++ python3

# Prepare app directory
RUN mkdir -p /usr/src/pcmall_backend && chown -R node:node /usr/src/pcmall_backend

WORKDIR /usr/src/pcmall_backend

# Copy package.json and yarn.lock with proper ownership
COPY --chown=node:node package.json yarn.lock ./

USER node

# Install dependencies
RUN yarn install --pure-lockfile

# Copy rest of the code
COPY --chown=node:node . .

EXPOSE 3000