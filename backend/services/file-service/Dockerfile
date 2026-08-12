FROM node:22-alpine

WORKDIR /app

# Copy shared package
COPY shared /app/shared

# Install shared dependencies
WORKDIR /app/shared
RUN npm install

# Copy file-service package
COPY file-service /app/file-service

# Install file-service dependencies
WORKDIR /app/file-service
RUN npm install

EXPOSE 3006

CMD ["npm", "start"]