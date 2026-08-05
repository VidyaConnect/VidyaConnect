FROM node:22-alpine

WORKDIR /app

COPY shared ./shared
RUN npm install --prefix ./shared

COPY file-service ./file-service

WORKDIR /app/file-service

RUN npm install

EXPOSE 3006

CMD ["npm", "start"]