FROM node:22-alpine

WORKDIR /app

COPY shared ./shared
RUN npm install --prefix ./shared

COPY assignment-service ./assignment-service

WORKDIR /app/assignment-service
RUN npm install

EXPOSE 3004

CMD ["npm", "start"]