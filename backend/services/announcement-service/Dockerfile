FROM node:22-alpine

WORKDIR /workspace

# Copy the shared package
COPY shared ./shared

# Copy the announcement service
COPY announcement-service ./announcement-service

# Install dependencies from inside the service folder
WORKDIR /workspace/announcement-service

RUN npm install

EXPOSE 3002

CMD ["npm", "start"]