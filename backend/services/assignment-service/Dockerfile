FROM node:22-alpine

WORKDIR /app

COPY shared ./shared
<<<<<<< HEAD
RUN npm install --prefix ./shared

COPY assignment-service ./assignment-service

WORKDIR /app/assignment-service
=======

COPY assignment-service ./assignment-service

WORKDIR /app/assignment-service

>>>>>>> 5195cd6f975c7ffd149f75c44c8c2389cf261ca1
RUN npm install

EXPOSE 3004

CMD ["npm", "start"]