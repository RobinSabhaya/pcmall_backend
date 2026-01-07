FROM node:20

WORKDIR /app

COPY package*.json ./

# For build require dev deps
RUN npm install -D @swc/cli @swc/core

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["node", "dist/main"]
