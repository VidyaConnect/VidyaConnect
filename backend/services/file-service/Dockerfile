FROM node:22-alpine

WORKDIR /app

COPY shared ./shared
WORKDIR /app/shared
RUN npm install

WORKDIR /app/file-service
COPY file-service/package*.json ./
RUN npm install
COPY file-service/. .

EXPOSE 3006

CMD ["npm", "start"]