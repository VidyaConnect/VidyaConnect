
# Attendance Service

## Overview

The Attendance Service manages student attendance records, absence responses, and teacher/admin attendance workflows within VidyaConnect.

## Responsibilities

- Record daily student attendance (Present, Absent, Late)
- Provide teacher roster and summary APIs
- Provide school admin attendance overview APIs
- Accept parent absence reason submissions
- Link uploaded absence documents via `fileId` from file-service

## Technology Stack

- Node.js + Express.js
- PostgreSQL (`attendance` schema)
- Prisma ORM
- Docker
- Keycloak JWT auth (via `@vidyaconnect/shared`)

## API Endpoints

All routes are mounted at `/attendance`.

| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/summary` | TEACHER, SCHOOL_ADMIN | Daily class attendance summary |
| GET | `/roster` | TEACHER, SCHOOL_ADMIN | Class roster with today's status |
| POST | `/roster/:studentId` | TEACHER, SCHOOL_ADMIN | Mark student attendance |
| GET | `/admin/overview` | SCHOOL_ADMIN | School-wide attendance overview |
| GET | `/admin/classes/:classId/roster` | SCHOOL_ADMIN | Class roster for admin view |
| GET | `/parent/alert` | PARENT | Latest absence alert for linked student |
| POST | `/absence/reason` | PARENT | Submit absence reason (optional `fileId`) |
| POST | `/absence/document` | PARENT | Link uploaded document via `fileId` |
| GET | `/history/:studentId` | PARENT, TEACHER, SCHOOL_ADMIN | Attendance history |

## Database

Schema: `attendance`

Tables:
- `class_roster_entries` — local roster snapshot for attendance workflows
- `attendance_records` — daily attendance per student
- `absence_responses` — parent-submitted reasons and linked `fileId`

Run migrations:

```bash
npm run prisma:migrate:dev
```

## Running Locally

```bash
cd backend/services/attendance-service
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate:dev
npm run dev
```

Service runs on port `3003`.

## Docker

From repository root:

```bash
docker compose -f infra/docker/docker-compose.local.yml up --build
```

Mobile/web clients can call `http://localhost:3000/attendance/*` through Nginx.

## Local Auth

Set `AUTH_DISABLED=true` in `.env` for local development without Keycloak. Override dev user context with `DEV_*` variables.

## File Upload Integration

Absence documents are uploaded through **file-service** (see `feature/file-storage` branch). After upload, pass the returned `fileId` to:

- `POST /attendance/absence/reason` with `{ reason, fileId, fileName }`, or
- `POST /attendance/absence/document` with `{ fileId, fileName, reason? }`
