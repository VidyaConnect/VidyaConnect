FROM node:22-alpine

WORKDIR /app

COPY shared ./shared
<<<<<<< HEAD
RUN npm install --prefix ./shared

COPY announcement-service ./announcement-service

WORKDIR /app/announcement-service
=======

COPY announcement-service ./announcement-service

WORKDIR /app/announcement-service

>>>>>>> 5195cd6f975c7ffd149f75c44c8c2389cf261ca1
RUN npm install

EXPOSE 3002

<<<<<<< HEAD
CMD ["npm", "start"]
=======
CMD ["npm", "start"]
>>>>>>> 5195cd6f975c7ffd149f75c44c8c2389cf261ca1
