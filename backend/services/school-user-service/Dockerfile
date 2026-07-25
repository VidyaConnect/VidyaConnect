# Use Node.js 22 LTS Alpine image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Expose application port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]