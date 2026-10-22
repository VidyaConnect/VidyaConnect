
FROM node:22-alpine

WORKDIR /app

# Copy the shared package into the container
COPY shared /shared

# Copy the file-service application
COPY file-service/ ./

# Install dependencies using the correct Linux path
RUN npm pkg set "dependencies.@vidyaconnect/shared=file:/shared" \
    && rm -f package-lock.json \
    && npm install

EXPOSE 3006

CMD ["npm", "start"]
