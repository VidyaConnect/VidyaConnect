FROM node:22-alpine
WORKDIR /app

COPY communication-service ./communication-service
WORKDIR /app/communication-service
RUN npm install

EXPOSE 3009
CMD ["npm", "start"]