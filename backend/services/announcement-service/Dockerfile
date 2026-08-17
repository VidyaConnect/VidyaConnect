FROM node:22-alpine

WORKDIR /app

COPY shared ./shared
RUN npm install --prefix ./shared

COPY announcement-service ./announcement-service

WORKDIR /app/announcement-service
RUN npm install

EXPOSE 3002

CMD ["npm", "start"]