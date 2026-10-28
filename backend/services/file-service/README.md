# File Service

## Overview

The File Service manages secure file upload, storage, and retrieval for VidyaConnect using **LocalStack S3** (dev) / **AWS S3** (prod), with **PostgreSQL** storing file metadata.

The shared API accepts files up to 25 MiB. Feature pages can apply a stricter limit and allow PDFs/images through their file input. Uploads require an authenticated user with school context; public pre-registration uploads must continue through the onboarding service until a separate staging flow is designed.

## Responsibilities

- Generate **pre-signed S3 upload URLs** so clients upload directly to S3 (no server-side streaming)
- Generate **pre-signed S3 download URLs** for secure, time-limited file access
- Store file **metadata** (name, size, content-type, S3 key, status, purpose) in PostgreSQL
- Enforce **school-level access control** — files are scoped per school
- Soft-delete files (status = `DELETED`) with best-effort S3 cleanup

## Technology Stack

- **Node.js** + **Express.js** (ESM modules)
- **AWS SDK v3** (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`)
- **Prisma ORM** — `file.file_metadata` PostgreSQL table
- **LocalStack** (local S3 emulator, bucket: `vidyaconnect-files`)
- **Docker** (port 3006)

## API Endpoints

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| `POST` | `/files/upload-url` | TEACHER, PARENT, SCHOOL_ADMIN | Get pre-signed upload URL |
| `POST` | `/files/:fileId/confirm` | TEACHER, PARENT, SCHOOL_ADMIN | Confirm upload completed |
| `GET` | `/files/:fileId/download-url` | All roles | Get pre-signed download URL |
| `GET` | `/files/:fileId` | All roles | Get file metadata |
| `GET` | `/files/` | TEACHER, SCHOOL_ADMIN | List school files |
| `DELETE` | `/files/:fileId` | SCHOOL_ADMIN | Soft-delete a file |

## Upload Flow

```
Client → POST /files/upload-url → service returns { fileId, uploadUrl }
Client → PUT uploadUrl (directly to S3/LocalStack)
Client → POST /files/:fileId/confirm → status set to COMPLETED
```

## Running Locally

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run DB migrations
npm run prisma:migrate:dev

# Start dev server (with nodemon)
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Key variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3006` | Service port |
| `DATABASE_URL` | — | PostgreSQL connection string (`schema=file`) |
| `AWS_ENDPOINT` | `http://localhost:4566` | S3 endpoint used for service-side operations |
| `AWS_PUBLIC_ENDPOINT` | `http://localhost:4566` | Browser-reachable endpoint used when signing URLs |
| `AWS_REGION` | `ap-southeast-1` | AWS region |
| `AWS_ACCESS_KEY_ID` | `test` | LocalStack credential |
| `AWS_SECRET_ACCESS_KEY` | `test` | LocalStack credential |
| `S3_BUCKET` | `vidyaconnect-files` | S3 bucket name |
| `S3_BUCKET` | `vidyaconnect-files` | S3 bucket name |
| `WEB_ORIGIN` | `http://localhost:3000` | Allowed browser origin for the File Service API |
| `AUTH_DISABLED` | `false` in Compose | Bypass JWT auth only for isolated local development |

For Compose, keep `AWS_ENDPOINT=http://localstack:4566` and `AWS_PUBLIC_ENDPOINT=http://localhost:4566`: the first is reachable inside Docker, while the second is reachable by the browser. LocalStack must have CORS enabled for the frontend origin and the configured bucket.
