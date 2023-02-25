FROM node:lts-alpine

ENV VUE_APP_SOCKET_ENDPOINT='https://noisy-shoes-production.up.railway.app/'

RUN npm install -g http-server

RUN mkdir /app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "http-server", "dist", "-a", "0.0.0.0" ]