FROM node:22-alpine

# Prisma's engine needs openssl on Alpine
RUN apk add --no-cache openssl

WORKDIR /app

# shared package (package.json points to file:../shared)
COPY shared ./shared
RUN npm install --prefix ./shared

COPY calendar-service ./calendar-service
WORKDIR /app/calendar-service

RUN npm install
RUN npx prisma generate

EXPOSE 3010

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]