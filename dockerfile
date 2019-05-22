FROM node:10.15-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

RUN mkdir /maven

EXPOSE 8080
CMD [ "npm", "start" ]