FROM node:22-alpine
WORKDIR /app

COPY shared ./shared
WORKDIR /app/shared
RUN npm install

WORKDIR /app
COPY school-user-service ./school-user-service
WORKDIR /app/school-user-service
RUN npm install
RUN DATABASE_URL="postgresql://postgres:postgres@postgres:5432/vidyaconnect?schema=school_user" npx prisma generate

EXPOSE 3001
CMD ["npm", "start"]
