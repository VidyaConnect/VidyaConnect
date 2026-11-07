FROM node:22-alpine

WORKDIR /app

COPY shared ./shared
RUN npm install --prefix ./shared

COPY attendance-service ./attendance-service

WORKDIR /app/attendance-service

RUN npm install
RUN npx prisma generate

EXPOSE 3003

CMD ["sh", "-c", "npx prisma migrate resolve --applied 20260726100000_init_attendance 2>/dev/null || true; npx prisma db push --skip-generate; npm start"]
