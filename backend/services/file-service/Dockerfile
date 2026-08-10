FROM node:22-alpine

WORKDIR /app

# Copy shared package first (dependency)
COPY shared /app/shared

# Copy file-service package files
COPY file-service/package*.json ./

# Install dependencies (this will resolve file:../shared correctly)
RUN npm install

# Copy file-service source code
COPY file-service/. .

EXPOSE 3006

CMD ["npm", "start"]