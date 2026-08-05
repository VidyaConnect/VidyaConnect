FROM node:22-alpine

WORKDIR /app

COPY shared ./shared

COPY notification-service ./notification-service

WORKDIR /app/notification-service

RUN npm install

EXPOSE 3007

CMD ["npm", "start"]