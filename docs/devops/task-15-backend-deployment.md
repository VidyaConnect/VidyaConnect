# Task 15: Propose Backend Deployment from Scratch

**Project:** VidyaConnect – Sri Lanka School Communication Platform  
---

## 1. Overview

This document proposes how the VidyaConnect Node.js + Express REST API backend will be deployed on AWS from scratch. It covers the chosen deployment approach, the reasoning behind each decision, the full setup process, and environment configuration.

---

## 2. Deployment Approach — Options Considered

### Option A: AWS EC2 with Docker (Recommended)
Run the Node.js app inside a Docker container on an EC2 instance. GitHub Actions builds and pushes the Docker image, then SSH deploys to EC2.

| Pros | Cons |
|---|---|
| Full control over environment | More setup time initially |
| Consistent across all environments | Requires Docker knowledge |
| Easy to debug and SSH into | Manual scaling (acceptable for pilot) |
| Free tier eligible (t2.micro) | |
| Integrates with GitHub Actions | |

### Option B: AWS Elastic Beanstalk
AWS managed service that handles deployment, scaling, and load balancing automatically.

| Pros | Cons |
|---|---|
| Easier initial setup | Less control, harder to debug |
| Auto-scaling built in | Abstracts infrastructure — bad for learning |
| Handles server patching | Not Free Tier for all configs |

### Option C: AWS Lambda (Serverless)
Run API as serverless functions triggered by HTTP requests via API Gateway.

| Pros | Cons |
|---|---|
| No server management | Cold start latency (bad for school morning rush) |
| Pay per request | Requires rewriting Express app as Lambda functions |
| Auto-scales | More complex to debug |

---

## 3. Recommended Approach — EC2 with Docker

**EC2 + Docker** is chosen because:
- The team already has a Node.js + Express codebase — no rewriting needed
- Docker ensures the app runs identically on every developer's machine and on the server
- EC2 t2.micro is Free Tier eligible for 12 months
- SSH access allows the team to debug directly when issues arise
- The approach is standard in industry and aligns with what the mentor expects

---

## 4. Backend Deployment Architecture

```
Developer pushes to GitHub main branch
            ↓
GitHub Actions workflow triggers
            ↓
Build Docker image from Dockerfile
            ↓
Push image to Amazon ECR
            ↓
SSH into EC2 → pull latest image from ECR
            ↓
Stop old container → start new container
            ↓
Node.js API running on EC2 port 3000
            ↓
Nginx reverse proxy → port 80/443 (HTTPS)
            ↓
Clients (React Native app, Next.js portal)
```

---

## 5. EC2 Instance Setup — Step by Step

### Step 1 — Launch EC2 Instance
1. Go to AWS Console → EC2 → Launch Instance
2. Name: `vidyaconnect-backend`
3. AMI: Ubuntu Server 22.04 LTS (Free Tier eligible)
4. Instance type: `t2.micro` (Free Tier eligible)
5. Key pair: Create new → name `vidyaconnect-key` → download `.pem` file → store securely
6. Security Group — create new with these inbound rules:

| Type | Port | Source | Purpose |
|---|---|---|---|
| SSH | 22 | Your IP only | Server access |
| HTTP | 80 | 0.0.0.0/0 | Web traffic |
| HTTPS | 443 | 0.0.0.0/0 | Secure web traffic |
| Custom TCP | 3000 | Security group only | Node.js (internal) |

7. Storage: 20 GB gp2 (Free Tier eligible)
8. Click Launch Instance

### Step 2 — Assign Elastic IP
1. EC2 → Elastic IPs → Allocate Elastic IP
2. Associate with `vidyaconnect-backend` instance
3. Note the IP address — this is your permanent server address

### Step 3 — SSH Into the Server
```bash
chmod 400 vidyaconnect-key.pem
ssh -i vidyaconnect-key.pem ubuntu@<your-elastic-ip>
```

### Step 4 — Install Dependencies on EC2
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Install AWS CLI (to pull from ECR)
sudo apt install -y awscli

# Install Nginx
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 5 — Configure Nginx as Reverse Proxy
Create the Nginx config file:
```bash
sudo nano /etc/nginx/sites-available/vidyaconnect
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name <your-elastic-ip>;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/vidyaconnect /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6 — Create Dockerfile for Node.js Backend
In the backend repository root, create `Dockerfile`:
```dockerfile
# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "src/index.js"]
```

### Step 7 — Create docker-compose for Local Development
Create `docker-compose.yml` in the project root:
```yaml
version: '3.8'
services:
  api:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/vidyaconnect
    depends_on:
      - db
    volumes:
      - ./backend:/app
      - /app/node_modules

  db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=vidyaconnect
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Step 8 — Environment Variables
Create a `.env.example` file (committed to GitHub):
```env
# Server
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://username:password@rds-endpoint:5432/vidyaconnect

# Authentication
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRY=24h

# AWS S3
AWS_REGION=ap-southeast-1
AWS_S3_BUCKET=vidyaconnect-pilot-files
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Firebase Cloud Messaging
FCM_SERVER_KEY=your-fcm-server-key
```

The actual `.env` file is **never committed to GitHub** — it is stored on the EC2 server directly.

Add `.env` to `.gitignore`:
```
.env
*.pem
node_modules/
```

---

## 6. Environment Strategy

| Environment | Where it runs | Database | Purpose |
|---|---|---|---|
| Local | Developer's machine via Docker Compose | Local PostgreSQL container | Daily development |
| Development | EC2 (dev branch deploys here) | RDS dev instance | Team integration testing |
| Production/Demo | EC2 (main branch deploys here) | RDS production instance | Pilot school + panel demo |

**Branch strategy:**
- `main` → production/demo environment
- `develop` → development environment
- Feature branches → local only

---

## 7. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| EC2 instance runs out of memory (1 GB RAM) | High | Monitor with CloudWatch; optimise Node.js memory usage; upgrade to t3.small if needed |
| Deployment breaks production | High | Always deploy to dev environment first; only merge to main after testing |
| SSH key lost | High | Store `.pem` file in a secure shared location (not GitHub); keep a backup |
| Server restarts and app does not start | Medium | Configure Docker to restart automatically: `--restart always` flag |
| Free tier hours exceeded | Medium | Monitor EC2 usage in AWS Billing; set billing alert at $1 |

---

## 8. References

- AWS EC2 User Guide: docs.aws.amazon.com/ec2/index.html
- Docker documentation: docs.docker.com/get-started
- Nginx reverse proxy guide: nginx.org/en/docs
- Node.js Docker best practices: nodejs.org/en/docs/guides/nodejs-docker-webapp
- AWS ECR: docs.aws.amazon.com/ecr
