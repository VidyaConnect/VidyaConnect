# VidyaConnect Technical Direction Summary

Reviewer: Ishan Liyanage  
Purpose: summarize the agreed technical direction for VidyaConnect based on mentor feedback and architecture review discussions

## 1. Application Architecture

VidyaConnect should use a layered monolithic architecture for the foundation implementation.

The backend should not be designed as microservices at this stage. A layered monolith is more suitable for a five-student university project because it is easier to build, test, deploy, and understand.

Recommended backend layers:

- Controller / API layer
- Authentication, RBAC, and tenant middleware
- Service / business logic layer
- Repository / data access layer
- External service adapters

Every school-specific request must enforce `school_id` / tenant isolation.

## 2. Backend

Recommended backend stack:

- Node.js
- Express.js
- REST API
- TypeScript, if the team is comfortable with it
- Prisma or another structured ORM/migration tool

Deployment direction:

- Deploy the backend as a container on AWS EC2.
- Use Nginx as the reverse proxy.
- Use Docker as the preferred runtime.
- PM2 can be used only as a fallback if Docker becomes too time-consuming.
- Use GitHub Actions for CI/CD.

## 3. Web/Admin Frontend

The web/admin frontend should not use AWS Amplify for the foundation deployment.

The goal is for students to learn practical deployment concepts, not to hide deployment behind a managed frontend platform.

Recommended approach:

- Build the web/admin frontend as a Node.js/Next.js application.
- Package it as a container.
- Deploy it on AWS EC2.
- Use Nginx to route traffic to the frontend container and backend API container.

Suggested architecture wording:

```text
The web/admin frontend will be built as a Node.js/Next.js application and deployed as a container on AWS EC2. Nginx will route traffic to the frontend container and backend API container. AWS Amplify is not used in the foundation deployment because the project aims to give students practical experience with containerized deployment and server configuration.
```

## 4. Mobile App

The mobile application should be built using React Native.

The mobile app is not deployed like a web application. It should be built and distributed separately.

Recommended approach:

- Use React Native with Expo if suitable.
- Build Android-first if the team needs to reduce complexity.
- Use Expo/EAS or APK/AAB builds for testing.
- Do not treat AWS Amplify as the deployment target for the React Native mobile UI.

## 5. Database

Recommended database:

- AWS RDS PostgreSQL

Why PostgreSQL:

- The domain is relational.
- Schools, users, students, parents, teachers, classes, attendance, assignments, and consent forms have strong relationships.
- Foreign keys and constraints help protect data integrity.
- It supports tenant-scoped access using `school_id`.

Database expectations:

- Use migrations.
- Avoid manual database changes in production-like environments.
- Every school-specific entity must be directly or indirectly scoped to a school.

## 6. File Storage

Recommended file storage:

- AWS S3

Use S3 for:

- consent attachments
- absence letters / medical certificates
- assignment attachments
- profile images
- bulk upload files
- generated reports, if needed

Recommended access pattern:

- Store file metadata in PostgreSQL.
- Store actual files in S3.
- Use pre-signed URLs for secure upload/download.
- Keep S3 objects private by default.
- Enforce `school_id` / tenant access before generating file URLs.

## 7. Notifications

The notification architecture must be consistent across the SRS, architecture document, and diagrams.

Recommended model:

```text
Backend Notification Service publishes notification events.
AWS SNS acts as the dispatch layer.
SNS delivers through platform push providers such as Firebase Cloud Messaging for Android and APNs for iOS.
```

Notification rules:

- Notification content should be minimal and non-sensitive.
- Full details should only be visible after authenticated login.
- Notifications must be scoped to the correct user and school.
- Absence notifications should be part of the foundation scope.

## 8. Observability

VidyaConnect should use a hybrid observability approach.

### AWS CloudWatch

Use CloudWatch for AWS infrastructure monitoring:

- EC2 metrics
- RDS metrics
- basic system logs
- alarms
- infrastructure health

### OpenTelemetry and Grafana

In addition to CloudWatch, the team should deploy a self-hosted observability stack on EC2 using:

- OpenTelemetry
- Grafana
- Prometheus and/or Loki, if the team has capacity

Use this stack for application-level observability:

- structured backend logs
- request traces
- API latency
- error rates
- service-level dashboards

### Foundation Scope

Foundation observability should include:

- structured backend logs
- `GET /health` endpoint
- basic metrics endpoint
- CloudWatch EC2/RDS monitoring
- Grafana dashboard
- OpenTelemetry instrumentation for key API requests

### Extended Scope

Extended observability can include:

- distributed traces
- alert rules
- log correlation
- uptime monitoring

Observability should support the application. It should not become a separate large project that delays core product delivery.

## 9. API Contracts

The team should add API contracts at this stage, but keep them lightweight and foundation-scope only.

Recommended file:

```text
docs/api/api-contracts.md
```

Later, after the Markdown contract stabilizes, the team can convert it into:

```text
docs/api/openapi.yaml
```

Foundation API contract modules:

- Auth
- Schools / tenant basics
- Users / roles
- Classes
- Students / parents / teachers
- Announcements
- Assignments
- Attendance and absence response
- Consent forms
- Notifications
- Files
- Health check

Each endpoint should define:

- method and URL
- purpose
- allowed roles
- tenant rule
- request body
- success response
- error responses
- notes

Example:

```text
POST /api/v1/attendance

Purpose:
Teacher marks attendance for a class on a selected date.

Allowed roles:
Teacher, School Admin

Tenant rule:
Class must belong to the authenticated user's school_id.

Request:
{
  "classId": "cls_123",
  "date": "2026-07-09",
  "records": [
    { "studentId": "stu_001", "status": "PRESENT" },
    { "studentId": "stu_002", "status": "ABSENT" }
  ]
}

Success:
201 Created

Error:
400 Validation error
401 Unauthenticated
403 Not allowed / cross-school access
404 Class or student not found
```

## 10. DevOps Learning Goal

The foundation deployment should avoid easy managed platforms where possible.

Students should learn:

- Docker
- AWS EC2
- Nginx
- environment variables
- HTTPS
- GitHub Actions
- AWS RDS
- AWS S3
- AWS IAM
- AWS CloudWatch
- OpenTelemetry
- Grafana

The goal is not only to deploy the application, but also to understand how real infrastructure works.

## Final Technical Direction

The agreed technical direction is:

```text
Containerized backend + containerized web/admin app on AWS EC2,
AWS RDS PostgreSQL,
AWS S3,
AWS SNS for notification dispatch,
CloudWatch plus Grafana/OpenTelemetry for observability,
React Native mobile app built separately,
and lightweight API contracts added now for foundation modules.
```
