FROM node:20-alpine
WORKDIR /app
COPY shared ./shared
RUN npm install --prefix ./shared
COPY assignment-service ./assignment-service
WORKDIR /app/assignment-service
RUN npm install
ENV DATABASE_URL="postgresql://vidyaconnect_user:localpassword@localhost:5432/vidyaconnect?schema=assignment"
RUN npx prisma generate
EXPOSE 3004
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
