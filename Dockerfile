FROM node
# Instaling netcat for wait_for sh purposes
RUN apt update && apt install -y netcat

RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

USER root

RUN npm install

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "npm", "run", "start" ]