# VidyaConnect Local Development Setup Guide

This guide provides step-by-step instructions for engineers to clone, configure, and launch the **VidyaConnect local development foundation environment** for development and testing.

---

# Prerequisites

Before starting, ensure you have the following software installed on your local machine:

- **Docker Desktop (with Docker Compose support):** To run PostgreSQL, Keycloak, Nginx, LocalStack and other shared infrastructure services.
- **Git:** To clone the project repository.
- **Node.js (v18 or higher):** To run backend services and frontend applications.
- **npm:** Installed together with Node.js.
- **PostgreSQL Client (Optional):** Such as pgAdmin or DBeaver for database inspection.
- **Visual Studio Code (Recommended):** For development.

---

# 1. Clone the Repository

Clone the project repository and navigate to the project directory.

```bash
git clone https://github.com/VidyaConnect/VidyaConnect.git
cd VidyaConnect
```

---

# 2. Configure Environment Variables

Some backend services contain their own `.env.example` files.

For each service that provides one:

- Copy `.env.example` to `.env`.
- Update the environment variables according to your local development configuration.

> **Note:** Only create `.env` files where a corresponding `.env.example` exists. The project does not currently require a single root-level `.env` file.

---

# 3. Launch Local Infrastructure

From the project root directory, start the shared infrastructure services.

```bash
docker compose -f infra/docker/docker-compose.local.yml up -d
```

---

## Verify Running Services

| Service | Local URL / Port | Purpose |
|----------|------------------|---------|
| **Nginx Reverse Proxy** | http://localhost | Routes requests to frontend and backend services |
| **PostgreSQL Database** | localhost:5432 | Shared relational database |
| **Keycloak IAM** | http://localhost:8080 | Authentication, authorization, realms, clients and roles |
| **LocalStack** | http://localhost:4566 | Local AWS service emulation (S3, SNS) |

---

# 4. Launch Backend Microservices

Navigate to the required backend service.

Example:

```bash
cd backend/services/school-user-service
npm install
npm run dev
```

Repeat the same process for any additional backend services that need to be executed.

---

# 5. Launch the Web Frontend

```bash
cd web-front-end
npm install
npm run dev
```

Access the application at:

```
http://localhost:3000
```

---

# 6. Launch the Mobile Frontend

```bash
cd mobile-front-end
npm install
npm start
```

Follow the React Native instructions to launch the application on an emulator or connected device.

---

# Useful Docker Commands

### View Running Containers

```bash
docker ps
```

### View All Containers

```bash
docker ps -a
```

### View Infrastructure Logs

```bash
docker compose -f infra/docker/docker-compose.local.yml logs
```

### View Logs for a Specific Service

Example:

```bash
docker compose -f infra/docker/docker-compose.local.yml logs keycloak
```

Replace `keycloak` with:

- postgres
- nginx
- localstack

---

# Stop Local Infrastructure

```bash
docker compose -f infra/docker/docker-compose.local.yml down
```

---

# Restart Local Infrastructure

```bash
docker compose -f infra/docker/docker-compose.local.yml restart
```

---

# Reset Local Infrastructure

```bash
docker compose -f infra/docker/docker-compose.local.yml down -v
docker compose -f infra/docker/docker-compose.local.yml up -d
```

> **Warning:** This command removes Docker volumes and deletes locally stored development data.

---

# Basic Troubleshooting

## Docker Containers Do Not Start

Check running containers:

```bash
docker ps -a
```

View container logs:

```bash
docker compose -f infra/docker/docker-compose.local.yml logs
```

---

## Backend Cannot Connect to PostgreSQL

- Verify the PostgreSQL container is running.
- Check the database configuration in the service `.env` file.
- Ensure port **5432** is available.

---

## Keycloak Cannot Be Accessed

Verify Keycloak is running:

```bash
docker compose -f infra/docker/docker-compose.local.yml logs keycloak
```

---

## LocalStack Connection Issues

Verify LocalStack is running correctly.

Default endpoint:

```
http://localhost:4566
```

---

## npm Dependency Errors

Delete dependencies and reinstall packages.

```bash
rm -rf node_modules
npm install
```

---


# Notes

- Always start the shared infrastructure before launching backend services.
- Backend services can be started independently during development.
- LocalStack is used for local object storage instead of AWS.
- Keep service-specific configuration inside each service directory.
- Update this guide whenever the local development environment changes.
