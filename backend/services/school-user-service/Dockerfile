FROM node:22-alpine

WORKDIR /app

COPY shared ./shared
RUN npm install --prefix ./shared

COPY school-user-service ./school-user-service

WORKDIR /app/school-user-service
RUN npm install

EXPOSE 3001

CMD ["npm", "start"]