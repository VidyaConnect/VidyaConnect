FROM node:22-alpine

WORKDIR /app

COPY shared ./shared

COPY attendance-service ./attendance-service

WORKDIR /app/attendance-service

RUN npm install

EXPOSE 3003

CMD ["npm", "start"]