# VidyaConnect Technical Direction Summary

Reviewer: Ishan Liyanage  
Purpose: summarize the agreed technical direction for VidyaConnect based on mentor feedback and architecture review discussions

## 1. Application Architecture

VidyaConnect should use a microservices-oriented architecture for the foundation implementation.

Each major business capability should be implemented as a separate backend service with a clear responsibility, API boundary, code module, Docker container, and deployment route.

The foundation deployment can still be simple. Services may initially run on the same AWS EC2 instance using Docker Compose, but the codebase and containers should be structured so each service is independently buildable and deployable.

Recommended service boundaries:

- Auth / Identity Service
- School and User Management Service
- Announcement / Communication Service
- Assignment Service
- Attendance Service
- Consent Form Service
- Notification Service
- File Service
- Reporting Service

Each service should still follow clean internal layering:

- Controller / API layer
- Authentication, RBAC, and tenant middleware
- Service / business logic layer
- Repository / data access layer
- External service adapters

Every school-specific request must enforce `school_id` / tenant isolation.

Important rule:

```text
Do not make microservices only in diagrams. If the architecture says microservices, each service must have its own responsibility, API boundary, code module, Dockerfile/container, and deployment route.
```

## 2. Backend

Recommended backend stack:

- Node.js
- Express.js
- REST APIs per service
- TypeScript, if the team is comfortable with it
- Prisma or another structured ORM/migration tool

Deployment direction:

- Deploy each backend service as a separate container on AWS EC2.
- Use Docker Compose for the foundation deployment.
- Use Nginx as the reverse proxy / lightweight API gateway.
- Use Docker as the preferred runtime.
- Use GitHub Actions for CI/CD.

Suggested service routing:

```text
/api/v1/auth          -> Auth Service
/api/v1/schools       -> School and User Management Service
/api/v1/announcements -> Announcement / Communication Service
/api/v1/assignments   -> Assignment Service
/api/v1/attendance    -> Attendance Service
/api/v1/consent-forms -> Consent Form Service
/api/v1/notifications -> Notification Service
/api/v1/files         -> File Service
/api/v1/reports       -> Reporting Service
```

## 3. Service Communication and Ownership

For the foundation implementation, keep service communication simple.

Recommended approach:

- Use REST over HTTP between services only when one service needs data or an action from another service.
- Use internal events for notification-triggering workflows where practical.
- Avoid introducing Kafka, RabbitMQ, or complex service mesh tools at this stage unless there is a clear requirement.
- Use correlation/request IDs so logs can be traced across services.

Service ownership rules:

- Each service owns its own business logic.
- Each service owns its own tables or schema area in PostgreSQL.
- Other services should not directly query another service's tables.
- Shared concepts such as `school_id`, `user_id`, and role claims must be consistently represented across services.
- Cross-service calls must preserve authenticated user context and tenant context.

## 4. Web/Admin Frontend

The web/admin frontend should not use AWS Amplify for the foundation deployment.

The goal is for students to learn practical deployment concepts, not to hide deployment behind a managed frontend platform.

Recommended approach:

- Build the web/admin frontend as a Node.js/Next.js application.
- Package it as a container.
- Deploy it on AWS EC2.
- Use Nginx to route traffic to the frontend container and backend service containers.

Suggested architecture wording:

```text
The web/admin frontend will be built as a Node.js/Next.js application and deployed as a container on AWS EC2. Nginx will route traffic to the frontend container and backend microservice containers. AWS Amplify is not used in the foundation deployment because the project aims to give students practical experience with containerized deployment and server configuration.
```

## 5. Mobile App

The mobile application should be built using React Native.

The mobile app is not deployed like a web application. It should be built and distributed separately.

Recommended approach:

- Use React Native with Expo if suitable.
- Build Android-first if the team needs to reduce complexity.
- Use Expo/EAS or APK/AAB builds for testing.
- Do not treat AWS Amplify as the deployment target for the React Native mobile UI.

## 6. Database

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
- For the foundation deployment, services may share one AWS RDS PostgreSQL instance.
- Prefer separate schemas per service where practical.
- Avoid direct cross-service database access. A service should own its own tables/schema and expose data through its API.

## 7. File Storage

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

## 8. Notifications

The notification architecture must be consistent across the SRS, architecture document, and diagrams.

Recommended model:

```text
Backend services publish notification events.
AWS SNS acts as the dispatch layer.
SNS delivers through platform push providers such as Firebase Cloud Messaging for Android and APNs for iOS.
```

Notification rules:

- Notification content should be minimal and non-sensitive.
- Full details should only be visible after authenticated login.
- Notifications must be scoped to the correct user and school.
- Absence notifications should be part of the foundation scope.

## 9. Observability

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
- OpenTelemetry instrumentation for key API requests across services

### Extended Scope

Extended observability can include:

- distributed traces
- alert rules
- log correlation
- uptime monitoring

Observability should support the application. It should not become a separate large project that delays core product delivery.

## 10. API Contracts

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

## 11. DevOps Learning Goal

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
Microservices-oriented backend with each service running as a separate container,
containerized web/admin app on AWS EC2,
Nginx as reverse proxy / lightweight API gateway,
Docker Compose for the foundation deployment,
AWS RDS PostgreSQL,
AWS S3,
AWS SNS for notification dispatch,
CloudWatch plus Grafana/OpenTelemetry for observability,
React Native mobile app built separately,
and lightweight API contracts added now for foundation modules.
```
