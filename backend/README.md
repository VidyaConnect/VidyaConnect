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
