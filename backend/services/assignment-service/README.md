# Assignment Service

Teacher assignment lifecycle API and PostgreSQL schema. Assignment status is teacher-recorded after physical hand-in at school; no student upload endpoint is provided.

## Local setup

Open PowerShell at the repository root (`C:\Users\damsi\VidyaConnect`) before running repo-relative commands. If you start in `C:\Windows\System32`, first run `cd C:\Users\damsi\VidyaConnect`. Start the local stack with `docker compose -f infra/docker/docker-compose.local.yml up --build -d`. Local Keycloak imports `infra/keycloak/export/vidyaconnect-realm.json`. Database migrations seed demo teacher/class/roster and sample assignments. The assignment service applies Prisma migrations and runs on port 3004. If PowerShell opened in `C:\Windows\System32`, switch to the repository root first: `cd C:\Users\damsi\VidyaConnect`. If Keycloak already has a persisted realm, run `powershell -ExecutionPolicy Bypass -File .\infra\keycloak\setup-test-users.ps1` from the repository root to create/update the demo users.

For running it outside Docker, copy `.env.example` to `.env`, install dependencies, generate the Prisma client, and apply migrations:

```sh
npm install
npm run prisma:generate
npm run prisma:migrate:dev
npm run dev
```

## Prisma Studio

From `backend/services/assignment-service`, copy `.env.example` to `.env` once (`Copy-Item .env.example .env`), then run `npm install` and `npm run prisma:studio` after PostgreSQL is running. The `.env` file supplies the PostgreSQL `DATABASE_URL`. If Prisma Studio reports that `node_modules/prisma/build/index.js` is missing, `npm install` did not complete. It opens a browser at the Prisma Studio URL (default `http://localhost:5555`) for the `assignment` schema. To inspect other schemas, start Studio from their service folders, such as `backend/services/attendance-service` or `backend/services/school-user-service`.

## API

- `GET /health`
- `GET /classes` — authenticated teacher's assigned class
- `GET /assignments` and `GET /assignments/:assignmentId`
- `POST /assignments` — create draft with `title`, `subject`, `description`, `publishAt`, `dueAt`, and optional `{ fileId, fileName }` attachments
- `PATCH /assignments/:assignmentId` — edit a draft; attachments are replaced when included
- `DELETE /assignments/:assignmentId` — delete a draft
- `POST /assignments/:assignmentId/publish`
- `PATCH /assignments/:assignmentId/students/:studentId/status` — record physical hand-in status (`PENDING`, `COMPLETED`, `MISSING`), marks (0–100), and feedback

Teacher role and class membership are checked server-side. The class roster is captured when an assignment is created. Publication can be scheduled for a future `publishAt`; it becomes visible at that time. The deadline must follow the publication date. Files upload through the shared File Service to S3 or local object storage; students do not submit online.
