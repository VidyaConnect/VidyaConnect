# EC2 Container Deployment Plan — VidyaConnect

**Project:** VidyaConnect – Sri Lanka School Communication Platform  
**Owner:** K.G.H. Ravindya (DevOps / System Architecture)  
**Date:** 2026-07-16  
**Status:** Draft — for review before AWS access is confirmed  

---

## 1. Overview

This document describes how VidyaConnect will be deployed to an AWS EC2 instance using Docker containers. It covers the full deployment process from setting up the server to running all services in production.

---

## 2. Architecture on EC2

```
Internet
    │
    ▼
EC2 Instance (Ubuntu 22.04, t2.micro)
    │
    ▼
Nginx (port 80 → 443)
    │
    ├── /api/users/          → school-user-service:3001
    ├── /api/announcements/  → announcement-service:3002
    ├── /api/attendance/     → attendance-service:3003
    ├── /api/assignments/    → assignment-service:3004
    ├── /api/consent-forms/  → consent-form-service:3005
    ├── /api/files/          → file-service:3006
    ├── /api/notifications/  → notification-service:3007
    ├── /api/reports/        → report-service:3008
    ├── /auth/               → keycloak:8080
    └── /                   → web-admin:3000
            │
            ▼
        postgres (internal only — not exposed to internet)
```

All containers run on the same Docker network `vidyaconnect-network` and communicate internally. Only Nginx is exposed to the internet on ports 80 and 443.

---

## 3. EC2 Setup Steps

### Step 1 — Launch EC2 Instance

1. Go to AWS Console → EC2 → Launch Instance
2. Settings:

| Setting | Value |
|---|---|
| Name | vidyaconnect-production |
| AMI | Ubuntu Server 22.04 LTS |
| Instance type | t2.micro (Free Tier) |
| Key pair | Create new → vidyaconnect-key → download .pem |
| Security group | See Step 2 |
| Storage | 20 GB gp2 |

3. Click Launch Instance

### Step 2 — Configure Security Group

| Type | Port | Source | Purpose |
|---|---|---|---|
| SSH | 22 | Your IP only | Server access |
| HTTP | 80 | 0.0.0.0/0 | Web traffic (redirects to HTTPS) |
| HTTPS | 443 | 0.0.0.0/0 | Secure web traffic |

### Step 3 — Assign Elastic IP

1. EC2 → Elastic IPs → Allocate Elastic IP
2. Associate with `vidyaconnect-production` instance
3. Note the IP — this is your permanent server address

### Step 4 — SSH Into the Server


    chmod 400 vidyaconnect-key.pem
    ssh -i vidyaconnect-key.pem ubuntu@YOUR-ELASTIC-IP


### Step 5 — Install Docker and Dependencies


 # Update system
 sudo apt update && sudo apt upgrade -y

 # Install Docker
 sudo apt install -y docker.io
 sudo systemctl start docker
 sudo systemctl enable docker
 sudo usermod -aG docker ubuntu

 # Install Docker Compose plugin
 sudo apt install -y docker-compose-plugin

 # Install AWS CLI
 sudo apt install -y awscli

 # Install Git
 sudo apt install -y git

 # Log out and back in for Docker group to take effect
 exit
 ssh -i vidyaconnect-key.pem ubuntu@YOUR-ELASTIC-IP


### Step 6 — Clone the Repository


 cd /home/ubuntu
 git clone https://github.com/VidyaConnect/VidyaConnect.git vidyaconnect
 cd vidyaconnect


### Step 7 — Create the .env File


 cp infra/docker/.env.production.example infra/docker/.env
 nano infra/docker/.env


Fill in all real values — passwords, AWS keys, FCM key, domain name.

### Step 8 — Configure AWS CLI for ECR Access


 aws configure
 # Enter AWS Access Key ID
 # Enter AWS Secret Access Key
 # Region: ap-southeast-1
 # Output format: json


### Step 9 — Login to ECR and Pull Images


 aws ecr get-login-password --region ap-southeast-1 | \
   docker login --username AWS --password-stdin YOUR-ECR-REGISTRY

 cd infra/docker
 docker compose -f docker-compose.production.yml pull


### Step 10 — Start All Services


 docker compose -f docker-compose.production.yml up -d


### Step 11 — Verify All Services Running


docker ps


You should see all containers with status `Up`.

Check Nginx is working:

 curl http://localhost/

---


## 4. GitHub Actions Required Secrets

Go to GitHub repo → Settings → Secrets and variables → Actions → New repository secret:

| Secret Name | Value |
|---|---|
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `EC2_HOST` | Elastic IP of EC2 instance |
| `EC2_SSH_KEY` | Full contents of vidyaconnect-key.pem |
| `ECR_REGISTRY` | e.g. 123456789.dkr.ecr.ap-southeast-1.amazonaws.com |

---

## 5. Secrets and Environment Variable Approach

### Rules

| Rule | Detail |
|---|---|
| Never commit real .env | Only `.env.production.example` with empty values is in GitHub |
| .env lives on EC2 only | Created manually on the server by DevOps member |
| GitHub secrets for CI/CD | AWS keys and SSH key stored as GitHub encrypted secrets |
| No hardcoded passwords | All passwords come from environment variables |
| Different secrets per environment | Local and production use completely different passwords |

### .gitignore Must Include


.env
*.pem
*.key
*.crt
---

### Who Has Access to Secrets

| Secret | Who has access |
|---|---|
| EC2 .env file | DevOps member only |
| GitHub Actions secrets | GitHub Actions runner only (encrypted, not visible) |
| AWS IAM keys | DevOps member + GitHub Actions (minimum permissions) |
| EC2 SSH key (.pem) | DevOps member only — stored securely, not in GitHub |

---

## 6. Rollback Approach

If a deployment causes issues, roll back to the previous working version using these steps.

### Step 1 — Find the Previous Working Image Tag


# On EC2 — check Docker image history
docker images | grep vidyaconnect


Or check GitHub Actions — find the last successful deployment and note the commit SHA (IMAGE_TAG).

### Step 2 — Set Previous Image Tag


cd /home/ubuntu/vidyaconnect/infra/docker
export IMAGE_TAG=PREVIOUS-COMMIT-SHA
export ECR_REGISTRY=YOUR-ECR-REGISTRY


### Step 3 — Pull and Restart with Previous Images


 docker compose -f docker-compose.production.yml pull
 docker compose -f docker-compose.production.yml up -d


### Step 4 — Verify Rollback Worked


 docker ps
 curl http://localhost/


### Rollback Decision Table

| Situation | Action |
|---|---|
| One service broken | Restart only that service: `docker restart vidyaconnect-SERVICE-NAME` |
| Multiple services broken | Full rollback to previous IMAGE_TAG |
| Database migration failed | Restore from RDS/PostgreSQL backup before rolling back |
| Everything broken | `docker compose down` → fix → `docker compose up -d` |

---

## 7. Production Dry Run (Local Test)

Before deploying to EC2, test production mode locally:


 # Build all images locally
 docker compose -f infra/docker/docker-compose.production.yml build

 # Start with production config
 docker compose -f infra/docker/docker-compose.production.yml up

 # Verify services respond
 curl http://localhost/api/users/health
 curl http://localhost/api/announcements/health


This confirms the production Docker Compose file works before touching the real server.

---

## 8. Useful Commands on EC2


 # See all running containers
 docker ps

 # See logs of a specific service
 docker logs vidyaconnect-school-user-service

 # Restart one service
 docker restart vidyaconnect-announcement-service

 # Stop everything
 docker compose -f docker-compose.production.yml down

 # Start everything
 docker compose -f docker-compose.production.yml up -d

 # See disk usage
 docker system df

 # Clean up old images
 docker image prune -f

