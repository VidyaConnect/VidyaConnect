
# Attendance demo — quick start

## 1. Database (single port 5432)
```bash
docker compose -f infra/docker/docker-compose.local.yml up postgres -d
cd backend/services/attendance-service
npm install
npm run prisma:migrate:dev
npm run dev
```

## 2. Prisma Studio (attendance tables only)
```bash
cd backend/services/attendance-service
npm run prisma:studio
```
Opens http://localhost:5555 — models: `ClassRosterEntry`, `AttendanceRecord`, `AbsenceResponse`

**Do NOT run from `backend/services/`** — no schema there.

## 3. Web UI
```bash
cd web-front-end
npm install
npm run dev
```
- Portal: http://localhost:3000/dashboard
- Teacher attendance: http://localhost:3000/attendance/teacher
- Admin attendance: http://localhost:3000/attendance/school-admin

## 4. File storage (LocalStack)
```bash
docker compose -f infra/docker/docker-compose.local.yml up localstack file-service -d
curl http://localhost:3006/s3-test
```

## Key files for demo navigation
| Layer | Path |
|---|---|
| Teacher UI | `web-front-end/src/features/attendance/TeacherAttendancePage.tsx` |
| Admin UI | `web-front-end/src/features/attendance/AttendanceManagementPage.tsx` |
| API hooks | `web-front-end/src/features/attendance/hooks.ts` |
| Backend routes | `backend/services/attendance-service/src/routes/attendance.routes.js` |
| DB schema | `backend/services/attendance-service/prisma/schema.prisma` |
| File/S3 test | `backend/services/file-service/src/routes/s3-test.routes.js` |
