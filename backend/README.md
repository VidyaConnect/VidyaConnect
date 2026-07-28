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
