FROM node:22-alpine

WORKDIR /app

COPY shared ./shared
RUN npm install --prefix ./shared

COPY report-service ./report-service

WORKDIR /app/report-service
RUN npm install

EXPOSE 3008

CMD ["npm", "start"]