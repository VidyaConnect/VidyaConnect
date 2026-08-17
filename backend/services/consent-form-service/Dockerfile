FROM node:22-alpine

WORKDIR /app

COPY shared ./shared
<<<<<<< HEAD
RUN npm install --prefix ./shared

COPY consent-form-service ./consent-form-service

WORKDIR /app/consent-form-service
=======

COPY consent-form-service ./consent-form-service

WORKDIR /app/consent-form-service

>>>>>>> 5195cd6f975c7ffd149f75c44c8c2389cf261ca1
RUN npm install

EXPOSE 3005

CMD ["npm", "start"]