# School User Service

## Overview

The School User Service is responsible for managing schools and users within the VidyaConnect platform.

## Responsibilities

- Manage school information
- Manage user accounts
- Provide school and user related APIs
- Expose health check endpoint

## Technology Stack

- Node.js
- Express.js
- Docker

## Running Locally

Install dependencies:

```bash
npm install
```

## Prisma Studio

Run Studio inside Docker so it reaches the same PostgreSQL instance as the service:

```powershell
docker compose -f infra/docker/docker-compose.local.yml up -d school-user-prisma-studio
```

Open <http://localhost:5556>. Stop Studio when finished:

```powershell
docker compose -f infra/docker/docker-compose.local.yml stop school-user-prisma-studio
```
