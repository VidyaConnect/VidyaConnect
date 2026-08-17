FROM node:22-alpine
<<<<<<< HEAD

WORKDIR /app

COPY shared ./shared
RUN npm install --prefix ./shared

COPY school-user-service ./school-user-service

WORKDIR /app/school-user-service
RUN npm install

EXPOSE 3001

=======
WORKDIR /app

COPY shared ./shared
WORKDIR /app/shared
RUN npm install

WORKDIR /app
COPY school-user-service ./school-user-service
WORKDIR /app/school-user-service
RUN npm install
RUN npx prisma generate

EXPOSE 3001
>>>>>>> 5195cd6f975c7ffd149f75c44c8c2389cf261ca1
CMD ["npm", "start"]