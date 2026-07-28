# Announcement Service

## Overview

The **Announcement Service** is a backend service of the **VidyaConnect platform** responsible for managing announcements and communication updates between schools, teachers, students, and parents.

This service provides REST APIs for creating, updating, retrieving, and managing announcements. It uses Prisma ORM for database operations and PostgreSQL for persistent data storage.

---

## Responsibilities

The Announcement Service is responsible for:

- Creating announcements
- Updating announcements
- Retrieving announcements
- Managing school announcements
- Maintaining announcement records
- Supporting communication workflows
- Providing APIs for frontend and other backend services

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Backend runtime environment |
| Express.js | REST API development |
| TypeScript | Type-safe backend development |
| Prisma ORM | Database access and migration management |
| PostgreSQL | Relational database |
| Docker | Containerization and deployment |
| REST API | Service communication |

---

## Architecture Overview

```
Client Applications
        |
        |
        v
Announcement Service
        |
        |
        +----------------+
        |                |
        v                v
    Express.js       Prisma ORM
                         |
                         v
                  PostgreSQL Database
```

The service follows a layered backend architecture where:

- Routes handle API requests
- Controllers manage request and response logic
- Services contain business logic
- Prisma manages database communication

---

# Project Structure

```
announcement-service
│
├── prisma
│   ├── schema.prisma
│   └── migrations
│
├── src
│   ├── controllers
│   ├── routes
│   ├── services
│   ├── middleware
│   └── app.ts
│
├── Dockerfile
├── package.json
├── .env
└── README.md
```

---

# Prerequisites

Before running this service, install:

- Node.js (v18 or higher)
- npm
- Docker Desktop
- PostgreSQL (or PostgreSQL Docker container)

---

# Environment Configuration

Create a `.env` file inside the announcement-service directory.

Example:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/announcement_db"

PORT=3000

NODE_ENV=development
```

Update the database credentials according to your local setup.

---

# Installation

Navigate to the Announcement Service directory:

```bash
cd backend/services/announcement-service
```

Install dependencies:

```bash
npm install
```

---

# Database Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Create and apply migrations:

```bash
npx prisma migrate dev --name init_announcement
```

Check migration status:

```bash
npx prisma migrate status
```

Open Prisma Studio:

```bash
npx prisma studio
```

Prisma Studio allows developers to view and manage database tables through a web interface.

---

# Running Locally

Start the development server:

```bash
npm run dev
```

The service will start on:

```
http://localhost:3000
```

---

# Running with Docker

Build and start the service:

```bash
docker compose up --build
```

Run containers in background:

```bash
docker compose up -d
```

Stop containers:

```bash
docker compose down
```

Check running containers:

```bash
docker ps
```

---

# Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm start` | Start production server |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma migrate dev` | Create database migration |
| `npx prisma migrate status` | Check migration status |
| `npx prisma studio` | Open database management UI |

---

# API Endpoints

## Health Check

```
GET /health
```

Example response:

```json
{
  "status": "OK",
  "service": "announcement-service"
}
```

---

## Announcement APIs

### Create Announcement

```
POST /announcements
```

Creates a new announcement.

---

### Retrieve Announcements

```
GET /announcements
```

Retrieves available announcements.

---

### Update Announcement

```
PUT /announcements/:id
```

Updates an existing announcement.

---

### Delete Announcement

```
DELETE /announcements/:id
```

Deletes an announcement.

---

# Database Management

The Announcement Service uses **Prisma ORM** for database communication.

Important Prisma files:

```
prisma
│
├── schema.prisma       Database models
│
└── migrations          Database migration history
```

---

# Development Workflow

Create a feature branch:

```bash
git checkout -b feature/announcement-service
```

Make changes and test locally.

Commit changes:

```bash
git add .
git commit -m "Update announcement service"
```

Push changes:

```bash
git push origin feature/announcement-service
```

Create a Pull Request for code review.

---

# Troubleshooting

## Prisma Client Error

Run:

```bash
npx prisma generate
```

---

## Migration Problems

Check migration status:

```bash
npx prisma migrate status
```

Reset database during development:

```bash
npx prisma migrate reset
```

---

## Docker Problems

Restart Docker containers:

```bash
docker compose down
docker compose up --build
```

---

# Future Enhancements

Possible future improvements:

- Role-based announcement permissions
- Announcement scheduling
- Push notification integration
- File attachment support
- Announcement analytics

---

# Maintainer

VidyaConnect Development Team
