FROM node:20.17-bullseye as builder

ARG NPM_TOKEN=''

WORKDIR /node-app

COPY package*.json ./

RUN apt-get update && apt-get install -y \
  curl \
  libcurl3-dev

RUN npm config set '//registry.npmjs.org/:_authToken' ${NPM_TOKEN}

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine


WORKDIR /app

RUN npm install -g npm@9.8.1

COPY --from=builder /node-app/build /app/build
COPY --from=builder /node-app/package.json /app/package.json
COPY --from=builder /node-app/node_modules /app/node_modules


EXPOSE 9001

CMD ["node", "build/server.js"]
