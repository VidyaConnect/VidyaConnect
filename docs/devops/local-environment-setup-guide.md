# VidyaConnect Local Environment Setup Guide

Reviewer: Ishan Liyanage  
Purpose: define the recommended local development environment before AWS deployment

## 1. Main Principle

Before deploying anything to AWS, the team should first make the platform run locally using Docker Compose.

Rule:

```text
Nothing is considered ready for AWS until it runs locally using Docker Compose.
```

This gives every student a consistent development setup and reduces "it works on my machine" issues.

## 2. Local Environment Goal

The local environment should allow the team to run the foundation platform on student laptops.

It should support:

- Keycloak authentication
- PostgreSQL database
- backend microservices
- web/admin frontend
- Nginx routing
- LocalStack for AWS-like services
- basic observability
- local testing of the first vertical slice

## 3. Recommended Local Stack

Use:

- Docker
- Docker Compose
- Keycloak
- PostgreSQL
- LocalStack
- Nginx
- Grafana
- OpenTelemetry Collector
- Prometheus and/or Loki, if feasible

## 4. Suggested Docker Compose Services

Create a local Docker Compose setup similar to:

```text
docker-compose.local.yml

Services:
- keycloak
- postgres
- nginx
- auth-service
- school-user-service
- announcement-service
- attendance-service
- consent-form-service
- notification-service
- file-service
- reporting-service
- web-admin
- localstack
- otel-collector
- grafana
```

The team does not need to implement all backend services immediately. Empty/stub service containers can be added gradually.

## 5. Keycloak

Keycloak should run locally in Docker.

Local responsibilities:

- create `VidyaConnect` realm
- create local clients:
  - `mobile-app`
  - `web-admin`
  - `backend-services`
- create roles:
  - `SUPER_ADMIN`
  - `SCHOOL_ADMIN`
  - `TEACHER`
  - `PARENT`
  - `STUDENT`
- create sample users
- issue JWT tokens for local development

Recommended output:

```text
infra/keycloak/realm-export.json
```

The realm export should be committed only if it contains no real secrets.

## 6. PostgreSQL

PostgreSQL should run locally in Docker.

Recommended approach:

- Use one local PostgreSQL container.
- Create separate databases or schemas as needed.
- Keep Keycloak data separate from application data.
- Use migrations for app service schemas.

Example local databases:

```text
keycloak_db
vidyaconnect_school_user_db
vidyaconnect_announcement_db
vidyaconnect_attendance_db
```

For the foundation stage, the team may simplify this if needed, but service ownership must remain clear.

## 7. LocalStack

Use LocalStack to simulate AWS services locally.

Recommended foundation use:

- S3 simulation for file uploads

Possible extended use:

- SNS simulation for notification events
- SQS simulation if async messaging is introduced later

Recommended local flow for files:

```text
Client -> File Service -> LocalStack S3
```

Later AWS flow:

```text
Client -> File Service -> AWS S3
```

For notifications, keep the first local version simple:

```text
Client action -> Notification Service -> local notification log
```

Actual mobile push can be integrated later using SNS/FCM/APNs.

## 8. Nginx

Nginx should be used locally as a reverse proxy / lightweight API gateway.

Example routing:

```text
/                 -> web-admin
/auth             -> keycloak
/api/v1/schools   -> school-user-service
/api/v1/users     -> school-user-service
/api/v1/announcements -> announcement-service
/api/v1/attendance -> attendance-service
/api/v1/files     -> file-service
```

This helps the team learn how the production EC2 deployment will route traffic.

## 9. Observability

Start observability early, but keep it small.

Foundation local observability:

- structured JSON logs from backend services
- request ID / correlation ID
- `/health` endpoint per service
- basic `/metrics` endpoint if using Prometheus
- OpenTelemetry Collector
- Grafana dashboard

Useful first dashboard panels:

- request count
- error count
- API latency
- service health

Avoid spending too much time building a monitoring platform before the core app works.

## 10. Environment Files

Each service should have an example environment file.

Recommended:

```text
.env.example
services/<service-name>/.env.example
web-admin/.env.example
mobile-app/.env.example
```

Rules:

- Never commit real secrets.
- Use placeholder values in `.env.example`.
- Document required variables clearly.
- Keep local, staging, and production values separate.

## 11. First Local Milestone

The first successful local milestone should be:

```text
Login -> role-based access -> school_id tenant context -> create/view announcement
```

This proves:

- Docker Compose works
- Keycloak works
- JWT validation works
- role handling works
- `school_id` tenant context works
- one backend service works
- web/admin can call backend
- mobile app can later call the same backend
- database connectivity works

## 12. Recommended Implementation Order

Start with:

1. Docker Compose skeleton
2. PostgreSQL container
3. Keycloak container
4. Nginx container
5. one backend service with `/health`
6. JWT validation middleware
7. school/user seed data
8. announcement vertical slice
9. LocalStack S3 integration
10. basic observability

Do not start all modules at once.

## 13. Local Before AWS Checklist

Before deploying to AWS, confirm:

- Docker Compose starts successfully.
- Keycloak realm is configured.
- Sample users can log in.
- Backend service validates JWT tokens.
- `school_id` tenant context is available in requests.
- PostgreSQL migrations run locally.
- At least one vertical slice works end to end.
- Nginx routes requests correctly.
- LocalStack S3 works for file upload/download simulation.
- Logs can be viewed.
- Health endpoints work.
- Setup steps are documented.

## 14. Expected Student Deliverables

The team should eventually add:

- `docker-compose.local.yml`
- `.env.example`
- service-level `.env.example` files
- Keycloak realm export
- Nginx local config
- LocalStack setup notes
- local startup instructions
- troubleshooting notes

## 15. Short Team Message

```text
Before AWS deployment, please first make the platform run locally using Docker Compose. The local environment should include Keycloak, PostgreSQL, backend microservices, web-admin, Nginx, LocalStack, and basic observability.

Use LocalStack mainly for S3 simulation at first. Notifications can start as a local notification log before real push notification integration.

Nothing should be treated as ready for AWS until it runs locally through Docker Compose.
```
