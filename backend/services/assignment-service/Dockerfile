FROM node:22-alpine

WORKDIR /app

COPY shared ./shared

COPY assignment-service ./assignment-service

WORKDIR /app/assignment-service

RUN npm install

EXPOSE 3004

CMD ["npm", "start"]