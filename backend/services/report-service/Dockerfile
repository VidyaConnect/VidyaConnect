FROM node:22-alpine

WORKDIR /app

COPY shared ./shared
<<<<<<< HEAD
RUN npm install --prefix ./shared

COPY report-service ./report-service

WORKDIR /app/report-service
=======

COPY report-service ./report-service

WORKDIR /app/report-service

>>>>>>> 5195cd6f975c7ffd149f75c44c8c2389cf261ca1
RUN npm install

EXPOSE 3008

CMD ["npm", "start"]