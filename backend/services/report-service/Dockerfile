FROM node:22-alpine

WORKDIR /app

COPY shared ./shared

COPY report-service ./report-service

WORKDIR /app/report-service

RUN npm install

EXPOSE 3008

CMD ["npm", "start"]