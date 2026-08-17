FROM node:22-alpine

WORKDIR /app

COPY shared ./shared
RUN npm install --prefix ./shared

COPY consent-form-service ./consent-form-service

WORKDIR /app/consent-form-service
RUN npm install

EXPOSE 3005

CMD ["npm", "start"]