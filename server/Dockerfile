FROM node:lts-alpine

ENV TZ=America/New_York

ARG PORT=3000

RUN mkdir /app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE $PORT

CMD [ "node", "." ]