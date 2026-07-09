# VidyaConnect Architecture Document Review Feedback

Reviewer: Ishan Liyanage  
Focus: architecture document consistency, C4 diagrams, AWS alignment, multi-tenancy, NFRs, observability, and implementation readiness

## Overall Assessment

The updated architecture document is a strong improvement. It is now a real architecture document, not just a diagram placeholder.

The document includes many of the important areas discussed earlier:

- multi-tenancy and school-level isolation
- `school_id` / tenant-scoped access
- AWS / AWS Educate deployment direction
- microservices-oriented backend architecture
- C4-style diagrams
- security architecture
- non-functional requirements
- observability
- deployment and DevOps
- architecture decision records
- risks and mitigations

Overall, this is good progress and shows that the team has understood the architectural direction of VidyaConnect.

The remaining work is mainly consistency cleanup and making some sections more implementation-ready.

## Main Feedback Summary

- The document is much stronger than the previous version.
- The architecture direction is mostly correct.
- Multi-tenancy is now clearly stated.
- AWS direction is mostly aligned with the project expectation.
- The C2, C3, and code-level diagrams are useful additions.
- Some old wording remains and should be cleaned up.
- Notification architecture is inconsistent across the document and diagrams.
- Future-scope features such as AI/RAG and calendar sync should be labelled more clearly.
- NFRs should include measurable acceptance criteria.
- C3 component diagram should show backend boundaries more clearly.

## 1. Good Improvements

The following areas are now in good shape:

- The document clearly describes VidyaConnect as a multi-tenant platform.
- It explains that one hosted system supports multiple schools.
- It explains school-level data isolation.
- It includes mandatory `school_id` filtering in repository/data access logic.
- It includes AWS RDS PostgreSQL for relational data.
- It includes AWS S3 for uploaded files.
- It includes AWS CloudWatch for logs and monitoring.
- It includes AWS EC2, Docker, and Nginx for backend deployment.
- It includes GitHub Actions for CI/CD.
- It should clearly align with the intended microservices-oriented backend direction.
- It includes observability topics such as logs, errors, metrics, health checks, dashboards, and alerting.
- It includes ADRs explaining major architecture choices.
- It includes a code-level diagram for the authentication module.

These are strong improvements and should be kept.

## 2. Table Of Contents Must Be Updated

The table of contents still contains old deployment wording:

```text
9.4 Backend Deployment - Render
9.5 Web Portal Deployment - Vercel
```

The body content has moved closer to the AWS direction, but it should be updated to the latest agreed deployment direction:

```text
9.4 Backend Deployment - AWS EC2
9.5 Web/Admin Frontend Deployment - AWS EC2 Container
```

### Required Fix

Regenerate or manually update the table of contents.

The TOC must match the actual section headings.

## 3. Notification Architecture Must Be Consistent

There is still inconsistency in the notification architecture.

Some parts of the document say:

```text
AWS SNS
```

But the context diagram still shows:

```text
Firebase Cloud Messaging
```

The team should choose one final model and use the same wording everywhere.

### Recommended Model

Use this wording:

```text
The backend Notification Service publishes notification events to AWS SNS. AWS SNS acts as the notification dispatch layer and delivers mobile push notifications through platform push providers such as Firebase Cloud Messaging for Android and APNs for iOS.
```

This keeps AWS SNS as the architecture-level service while acknowledging that mobile push delivery still depends on platform push providers.

### Required Fix

Update all of these to use consistent wording:

- architecture document
- C1/context diagram
- C2/container diagram
- C3/component diagram
- DevOps notes
- SRS, if needed

## 4. Google Calendar Should Be Future Scope

The context diagram includes Google Calendar.

Calendar sync/export was previously treated as future scope. It should not appear as part of the foundation architecture unless the team has officially moved it into scope.

### Required Fix

Choose one:

```text
Option A: Remove Google Calendar from the foundation context diagram.
Option B: Keep Google Calendar, but label it clearly as Future Scope.
```

Recommended: remove it from the foundation architecture diagram and mention it only under Future Scope.

## 5. AI/RAG Should Be Labelled As Future Scope

The ADR section correctly says:

```text
RAG Architecture for AI Assistant
Status: Accepted for design; implementation deferred to Future Scope
```

That is good.

However, Section `5.4.9 AI Assistant Service (RAG)` makes it look like the AI Assistant is a normal backend service in the current architecture.

### Required Fix

Rename the section to:

```text
5.4.9 Future Scope: AI Assistant Service (RAG)
```

Also make sure the C3/component diagram does not show AI as a core current service unless it is clearly marked as Future Scope.

## 6. C3 Component Diagram Needs Clearer Backend Boundaries

The C3 component diagram is useful, but it still feels too high-level.

It should show how the backend is internally structured.

### Recommended C3 Backend Components

The C3 diagram should show:

- API routes/controllers
- Auth middleware
- RBAC middleware
- Tenant context middleware
- Validation layer
- Service layer
- Repository layer
- External service adapters
- Audit logging component
- Notification component

Example backend flow:

```text
Controller
  -> Middleware
  -> Service
  -> Repository
  -> PostgreSQL / S3 / SNS
```

### Required Fix

Update the C3 diagram so it does not look like the mobile/web UI directly talks to internal business services.

The UI should call the Backend REST API. Inside the backend, the request should flow through controllers, middleware, services, and repositories.

## 7. NFRs Need Measurable Acceptance Criteria

The NFR section is good, but some requirements are still descriptive rather than measurable.

For a university project, NFRs should be testable.

### Required Fix

For each important NFR, add:

```text
Measurement / Acceptance Criteria
```

Examples:

```text
Performance:
- Common API requests should respond within 2 seconds under normal load.

Availability:
- The backend shall expose a GET /health endpoint.

Security:
- Cross-school access attempts shall return 403 Forbidden.

Auditability:
- Sensitive actions such as attendance edits, consent submissions, role changes, and file uploads shall create audit log records.

File Security:
- S3 file access shall use pre-signed URLs with limited expiry.

Observability:
- Application errors shall be logged with timestamp, request ID, endpoint, and user context, without logging passwords, tokens, or sensitive student data.
```

## 8. Remove Remaining Old Wording

Some old wording still appears in the document.

Example:

```text
EC2/Render
```

Since the current direction is AWS/AWS Educate, remove old references to:

- Render
- Railway
- Vercel, unless used only as a rejected alternative
- Supabase, unless used only as a rejected alternative

### Required Fix

Search the whole document for:

```text
Render
Railway
Vercel
Supabase
Firebase
```

Then confirm each reference is either removed or clearly explained as an old/rejected alternative.

## 9. Web/Admin Frontend Deployment Should Be Containerized

The document currently uses AWS Amplify for the web portal.

The latest technical direction is that the web/admin frontend should be deployed as a container on AWS EC2, together with the backend microservice containers.

AWS Amplify should not be used for the foundation deployment because it hides too much of the deployment process. The students should learn containerized frontend deployment, Nginx routing, environment variables, HTTPS, and GitHub Actions deployment.

### Required Fix

Replace AWS Amplify references with this direction:

```text
The web/admin frontend will be built as a Node.js/Next.js application and deployed as a container on AWS EC2. Nginx will route traffic to the frontend container and backend microservice containers.
```

## 10. Authentication Code-Level Diagram Is Good

The authentication code-level diagram is one of the stronger additions.

It includes useful components:

- AuthController
- AuthService
- AuthMiddleware
- RBACMiddleware
- TenantContextMiddleware
- JWTUtil
- PasswordUtil
- UserRepository
- RefreshTokenRepository
- AuditLogger
- PostgreSQL

This is good because it connects architecture to implementation.

### Small Improvement

Add `school_id` / tenant context more visibly in the diagram.

Example:

```text
TenantContextMiddleware attaches req.context.schoolId
```

Also show that protected repository calls use:

```text
where: { school_id: context.schoolId }
```

This will make the multi-tenant enforcement stronger.

## 11. C2 Container Diagram Is Mostly Good

The C2 diagram is much better than the previous architecture diagram.

It correctly shows:

- mobile app
- web admin portal
- backend REST API
- PostgreSQL database
- S3 file storage
- notification service
- CloudWatch/logging
- main user roles

### Minor Fixes

- Rename `PostgreSQL Database` to `AWS RDS PostgreSQL` if that is the deployment choice.
- Rename `Notification Service` to `AWS SNS / Push Notification Service` or use the agreed notification wording.
- Make it clear whether the teacher uses mobile, web, or both.
- Avoid showing future features like marks if they are not foundation scope.

## 12. Context Diagram Still Needs Cleanup

The context diagram is improved, but still has a few issues.

### Issues

- It shows Firebase Cloud Messaging while the architecture document says AWS SNS.
- It shows Google Calendar, which should be Future Scope.
- It still has many data-flow labels, making it more like a data-flow diagram than a pure C1 context diagram.

### Required Fix

Keep the C1 diagram simple:

- actors
- VidyaConnect system
- external systems
- high-level relationships

Move detailed data flows to C2/C3 or sequence diagrams.

## 13. DevOps Files Are A Good Addition

The new DevOps task files are useful:

- AWS account setup
- AWS services research
- backend deployment
- database deployment
- S3 file storage

This matches the student learning goal well.

### Suggested Addition

Add future DevOps tasks for:

- CloudWatch logs and alerts
- GitHub Actions CI/CD
- Nginx and HTTPS setup
- environment variables and secrets
- backup and restore test

## 14. Add API Contracts

The architecture document describes the REST API layer, controllers, middleware, services, and backend boundaries. However, it does not contain real API contracts.

That is acceptable for an architecture document, but the project now needs a separate API contract document so mobile, web, and backend work can proceed without guessing.

### Required Fix

Create:

```text
docs/api/api-contracts.md
```

Start with a lightweight Markdown contract first. Later, after the API design stabilizes, the team can convert it into:

```text
docs/api/openapi.yaml
```

### Foundation Scope API Modules

The first API contract should cover foundation modules only:

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

### Each Endpoint Should Define

For every endpoint, include:

- method and URL
- purpose
- owning microservice
- allowed roles
- tenant rule
- request body
- success response
- error responses
- notes

### Example Format

```text
POST /api/v1/attendance

Owning service:
Attendance Service

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

### Why This Matters

API contracts are especially important because the project is microservices-oriented. Each service must have a clear boundary and defined contract. Without API contracts, students may build mobile screens, web screens, and backend services using different assumptions.

## 15. Final Priority Fix List

The team should prioritize these fixes:

1. Regenerate/update the table of contents.
2. Make notification architecture consistent across document and diagrams.
3. Remove or future-label Google Calendar.
4. Rename AI/RAG as Future Scope in Section 5.4.9.
5. Improve C3 diagram backend boundaries.
6. Add measurable NFR acceptance criteria.
7. Remove remaining old wording such as `EC2/Render`.
8. Rename PostgreSQL to AWS RDS PostgreSQL where deployment-specific.
9. Replace AWS Amplify web deployment with containerized web/admin deployment on EC2.
10. Make tenant context stronger in the authentication code-level diagram.
11. Add a foundation API contract document under `docs/api/api-contracts.md`.

## Suggested Message To Team

```text
Good improvement on the architecture document. It is now much stronger and includes the key sections expected: multi-tenancy, school_id isolation, AWS deployment direction, NFRs, observability, security, ADRs, risks, and C4-style diagrams.

Before treating it as final, please clean up consistency issues:

1. Regenerate/update the table of contents. It still mentions Render and Vercel, and the web/admin deployment should now be updated to EC2 container deployment.
2. Make notification architecture consistent. Some places say AWS SNS, while the context diagram still shows Firebase Cloud Messaging.
3. Remove Google Calendar from the foundation context diagram, or label it clearly as Future Scope.
4. Rename AI/RAG as Future Scope in Section 5.4.9.
5. Improve the C3 diagram to show backend boundaries clearly: controllers, middleware, services, repositories, and external adapters.
6. Add measurable acceptance criteria to important NFRs.
7. Remove remaining old wording such as EC2/Render.
8. Add a lightweight API contract document for foundation modules under docs/api/api-contracts.md.
9. Replace AWS Amplify references with containerized web/admin deployment on EC2.

Overall, this is a strong revision. The main remaining work is consistency cleanup and making the architecture easier to implement from.
```
