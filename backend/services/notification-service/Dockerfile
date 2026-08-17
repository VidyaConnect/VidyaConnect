FROM node:22-alpine

WORKDIR /app

COPY shared ./shared
<<<<<<< HEAD
RUN npm install --prefix ./shared

COPY notification-service ./notification-service

WORKDIR /app/notification-service
=======

COPY notification-service ./notification-service

WORKDIR /app/notification-service

>>>>>>> 5195cd6f975c7ffd149f75c44c8c2389cf261ca1
RUN npm install

EXPOSE 3007

CMD ["npm", "start"]