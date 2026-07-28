# Backend

This directory contains the backend services for the VidyaConnect platform — a mobile-first, role-aware school communication system for Sri Lankan schools.

## Overview

The backend is built as a set of independently deployable **microservices**, each owning a distinct area of the platform's data and business logic. Services communicate over REST, sit behind an API gateway, and share a single Keycloak identity provider for authentication.

## Planned Technology

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | Keycloak (OIDC), JWT |
| Containerization | Docker, Docker Compose |

## Main Responsibilities

- Authentication
- User Management
- School Management
- Announcements
- Attendance
- Assignments
- Consent Forms
- Notifications

  ## Architecture

Each microservice lives in its own folder under `backend/services/`:

```
backend/
└── services/
    ├── school-user-service/
    ├── announcement-service/
    ├── attendance-service/
    ├── assignment-service/
    ├── consent-form-service/
    ├── file-service/
    └── notification-service/
```

All services share one PostgreSQL instance but are isolated by **schema** — never by separate databases — so each service owns its own tables without owning its own database server:

| Service | Schema |
|---|---|
| School/User Service | `school_user` |
| Assignment Service | `assignment` |
| Attendance Service | `attendance` |
| Notification Service | `notification` |
| File Service | `file` |
| Report/Insights Service | `report` |

This keeps services independently deployable and testable, while still allowing simple local development with a single Postgres container.

## Standard Setup Steps for a New Microservice

Follow these steps, in order, whenever a new microservice is added to the platform. This keeps every service consistent and easy for the team to maintain.

### 1. Create the service folder

```
backend/
└── services/
    └── <service-name>/
```

### 2. Initialize Node.js

```bash
npm init -y
```

### 3. Install dependencies

```bash
npm install express cors dotenv prisma @prisma/client
```

Development dependencies:

```bash
npm install -D nodemon
```

If the service needs authentication:

```bash
npm install jose jwks-rsa
```

### 4. Create the project structure

```
<service-name>/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── repositories/
│   ├── middleware/
│   ├── generated/
│   ├── app.js
│   └── server.js
│
├── package.json
├── package-lock.json
├── prisma.config.ts
├── Dockerfile
├── .dockerignore
├── .gitignore
└── .env
```

### 5. Configure package.json

```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
  }
}
```

### 6. Create .env

```env
PORT=3002

DATABASE_URL=postgresql://username:password@postgres:5432/vidyaconnect?schema=<service_schema>

NODE_ENV=development
```

Each service should use its own schema — see the schema table above.

### 7. Configure Prisma

```bash
npx prisma init
```

Edit `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 8. Create initial models

Only include the entities owned by that service. For example, the Assignment Service owns:

- `Subject`
- `Assignment`
- `Submission`
- `TeacherSubjectMapping`
