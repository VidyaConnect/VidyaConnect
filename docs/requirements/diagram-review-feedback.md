# VidyaConnect Diagram Review Feedback

Reviewer: Ishan Liyanage  
Focus: diagram clarity, scope consistency, multi-tenancy, architecture alignment, and implementation readiness

## Overall Assessment

The team has prepared useful diagrams for the project, including the architecture diagram, context diagram, use case diagram, EER diagram, and class diagram. This is good progress.

The main issue is consistency. The diagrams currently mix foundation/MVP features, extended features, and future features. Some diagrams also include technology/deployment details in places where the diagram should focus on business actors or domain behavior.

The diagrams should now be cleaned up so they match the final SRS scope and the intended architecture direction for VidyaConnect.

## Main Feedback Summary

- Diagrams should clearly show that VidyaConnect is a multi-tenant platform.
- The `School` / tenant boundary must be visible in architecture and data diagrams.
- The use case diagram is too crowded and should be split by scope.
- The class diagram is useful, but it looks more like a domain/entity model than an application class diagram.
- The EER diagram is comprehensive, but too dense for normal review.
- The context diagram should focus on actors and external systems, not internal hosting details.
- The architecture diagram should be aligned with AWS/AWS Educate instead of Supabase/managed deployment platforms.
- Diagram names should accurately describe what each diagram represents.

## 1. Architecture Diagram Feedback

### What Is Good

- The diagram separates the system into logical layers:
  - Client Layer
  - API / Controller Layer
  - Service / Business Logic Layer
  - Data & External Services Layer
- It includes the main application clients:
  - React Native mobile app
  - Next.js web portal
- It includes core backend modules:
  - User/Admin Service
  - Announcement Service
  - Assignment Service
  - Consent Form Service
  - Attendance Service
  - Notification Service
- It shows Firebase Cloud Messaging for push notifications.

### Issues To Fix

- The diagram still shows `Supabase Storage`. Current project direction is AWS/AWS Educate.
- Replace `Supabase Storage` with `AWS S3`.
- Replace generic `Postgres DB` with `AWS RDS PostgreSQL` if AWS is the intended deployment target.
- Add `AWS CloudWatch` for logs and monitoring.
- Add `IAM` or mention IAM in the architecture document for AWS access control.
- Add `Nginx` and either `Docker` or `PM2` if the backend is deployed on EC2.
- Some arrows are visually messy and cross too many layers.
- The diagram should show the backend service layer calling the repository/data access layer, rather than every service directly pointing everywhere.
- It should show that every request passes through authentication, RBAC, and school/tenant access checks.

### Required Fix

Create a cleaner C2/C3-style architecture diagram:

```text
Mobile App / Web Portal
        |
        v
Backend API
        |
Auth + RBAC + Tenant Middleware
        |
Service Layer
        |
Repository / Data Access Layer
        |
PostgreSQL / S3 / FCM / CloudWatch
```

Also add a note:

```text
All school-specific API requests must be filtered by school_id / tenant scope.
```

## 2. Context Diagram Feedback

### What Is Good

- It identifies the main human actors:
  - Super Admin
  - School Admin
  - Teacher
  - Parent / Guardian
  - Student
- It shows VidyaConnect as the central system.
- It attempts to show external services.

### Issues To Fix

- The context diagram currently includes internal deployment concepts such as hosting, CI/CD pipeline, APK/IPA files, and storage.
- Those details are not ideal for a system context diagram.
- A context diagram should explain who uses the system and which external systems the platform interacts with.
- It should not try to explain internal architecture.
- It still shows `Supabase Storage`, which conflicts with the AWS direction.

### Required Fix

Create a C1 System Context Diagram with:

- VidyaConnect system boundary
- Parent / Guardian
- Teacher
- School Admin
- Student
- Super Admin
- Firebase Cloud Messaging
- AWS S3 for file storage
- Email/SMS provider if planned
- AWS CloudWatch if shown as an external operational system

Avoid showing:

- CI/CD pipeline
- build requests
- APK/IPA generation
- internal hosting details

Those belong in deployment or DevOps diagrams.

## 3. Use Case Diagram Feedback

### What Is Good

- The diagram covers the main user roles.
- It groups use cases by role.
- It includes important foundation features such as:
  - school registration
  - user management
  - announcements
  - assignments
  - consent forms
  - attendance
  - notification preferences

### Issues To Fix

- The diagram is too crowded.
- It mixes foundation/MVP, extended, and future features in one diagram.
- Some role names need consistency:
  - Use `Super Admin`, not generic `Administrator`.
  - Use `School Admin`, not `School Moderator`, unless `School Moderator` is formally defined.
- It includes features that may not belong in the foundation scope:
  - school communities
  - one-to-one messaging
  - assignment marks
  - student upload answer sheets
  - calendar extensions
  - community messages
- Some `include` and `extend` relationships look unclear or unnecessary.

### Required Fix

Split into at least two diagrams:

```text
1. Foundation / MVP Use Case Diagram
2. Extended / Future Use Case Diagram
```

### Foundation / MVP Use Case Diagram Should Include

- Super Admin registers schools.
- School Admin manages users, students, teachers, parents, classes.
- School Admin posts school-wide announcements.
- Teacher posts class announcements.
- Teacher posts assignments.
- Teacher marks attendance.
- Parent receives absence notification.
- Parent submits absence reason/document.
- School Admin creates consent forms.
- Parent submits consent response.
- Users view basic dashboards.

### Extended / Future Use Case Diagram Can Include

- parent-teacher messaging
- calendar/event management
- assignment submissions
- marks/feedback
- school community
- notification preferences
- advanced dashboards
- AI assistant
- LMS integration

## 4. EER Diagram Feedback

### What Is Good

- The EER diagram is detailed and shows many important entities.
- It includes key entities such as:
  - User
  - School
  - School Admin
  - Teacher
  - Parent
  - Student
  - Class
  - Subject
  - Assignment
  - Attendance Record
  - Absence Justification
  - Consent Form
  - Form Response
  - Announcement
  - Notification
  - Audit Log
  - Bulk Upload Log
- It already includes many relationships needed for implementation.

### Issues To Fix

- The diagram is too dense for normal review.
- It is difficult to read because many relationship lines cross each other.
- Multi-tenancy is present in some areas, but the tenant boundary is not visually clear enough.
- `school_id` or school-level ownership should be obvious for all school-scoped entities.
- Some extended/future entities appear mixed with foundation entities.
- The team should be careful not to over-design the database before finalizing scope.

### Required Fix

Create two versions:

```text
1. Foundation / MVP EER Diagram
2. Full / Extended EER Diagram
```

### Foundation / MVP EER Should Focus On

- School
- User
- Role / UserRole
- School Admin
- Teacher
- Parent / Guardian
- Student
- Class
- Subject
- Announcement
- Assignment
- Attendance Record
- Absence Justification
- Consent Form
- Consent Response
- Notification
- Audit Log
- Bulk Upload Log

### Multi-Tenancy Requirement

The EER must make this rule clear:

```text
Every school-specific record must either contain school_id directly or be linked to a parent entity that contains school_id.
```

Examples of school-scoped entities:

- Teacher
- Student
- Parent/Guardian relationship
- Class
- Subject
- Announcement
- Assignment
- Attendance Record
- Absence Justification
- Consent Form
- Consent Response
- Notification
- Audit Log
- Bulk Upload Log

## 5. Class Diagram Feedback

### What Is Good

- The diagram shows many important domain concepts.
- It is useful for understanding the business objects in the system.
- It includes user roles and entities related to announcements, assignments, attendance, consent, and notifications.

### Main Concern

The current class diagram looks more like a database/entity model than an application class diagram.

That is not necessarily wrong, but the name and purpose must be clear.

### Option 1: Rename It

If the diagram is intended to show business/domain entities, rename it to:

```text
Domain Model Diagram
```

or:

```text
Entity Class Diagram
```

This is the simpler and more suitable option.

### Option 2: Convert It To A Software Class Diagram

If the university expects a software design class diagram, add backend design classes such as:

- Controllers
- Services
- Repositories
- DTOs / Request models
- Entities / Models
- Middleware

Example:

```text
AttendanceController
AttendanceService
AttendanceRepository
AttendanceRecord
AbsenceJustification
NotificationService
AuditLogService
```

### Required Fix

The team should choose one of the following:

```text
Option A: Rename the current diagram to Domain Model / Entity Class Diagram.
Option B: Create a separate Backend Class Diagram showing controllers, services, repositories, and entities.
```

Do not leave it unclear.

## 6. Missing C4 Diagram Set

The team should add C4 diagrams to the architecture document.

Required:

- C1: System Context Diagram
- C2: Container Diagram
- C3: Component Diagram

Optional:

- C4: Code-level diagram for one important module, such as Attendance

### Suggested C4 Breakdown

```text
C1: VidyaConnect and external actors/systems
C2: Mobile app, web portal, backend API, database, file storage, notification service
C3: Backend components such as controllers, services, repositories, auth middleware, notification service, audit service
C4: Attendance module classes/functions
```

## 7. Scope Consistency Across Diagrams

All diagrams must follow the same scope classification used in the SRS:

```text
Core MVP / Foundation Scope
Extended Scope
Future Scope
```

Do not show a future feature as if it is part of the foundation build.

Examples:

- AI Assistant should be Future Scope.
- Health records should be Future Scope or removed.
- Discipline should be Future Scope unless explicitly approved.
- LMS integration should be Future Scope.
- Advanced messaging/community features should be Extended or Future Scope.
- Calendar sync/export should be Future Scope.
- Basic in-app event/calendar can be Extended Scope.

## 8. Diagram Naming Recommendations

Use clear names:

```text
architecture-c1-context.png
architecture-c2-container.png
architecture-c3-backend-components.png
domain-model-diagram.png
eer-foundation-scope.png
eer-full-scope.png
use-case-foundation-scope.png
use-case-extended-scope.png
deployment-aws-diagram.png
```

This will make the repository easier to understand.

## 9. Final Priority Fix List

The students should prioritize these diagram fixes:

1. Add clear multi-tenant / school boundary to data and architecture diagrams.
2. Replace Supabase/managed platform references with AWS/AWS Educate direction.
3. Split the use case diagram into foundation and extended/future versions.
4. Create a simplified foundation EER diagram.
5. Keep the full EER diagram as an extended/full-system reference.
6. Rename the class diagram to Domain Model / Entity Class Diagram, or create a separate backend class diagram.
7. Add C1, C2, and C3 diagrams to the architecture document.
8. Make role names consistent across all diagrams.
9. Remove or future-scope AI, health, discipline, LMS, and advanced community features.
10. Ensure diagrams, SRS, Figma, and GitHub issues all describe the same scope.

## Suggested Message To Team

```text
Good work preparing the project diagrams. The diagrams are useful, but they now need cleanup so they match the final SRS scope and architecture direction.

Please make multi-tenancy clear in the diagrams. VidyaConnect should be shown as one platform supporting many schools, with each school acting as a tenant and all school-specific data isolated by school_id / tenant scope.

Please split crowded diagrams where needed. The use case diagram should have a Foundation/MVP version and a separate Extended/Future version. The EER diagram should also have a simplified Foundation/MVP version, while keeping the full diagram as a reference.

The class diagram currently looks more like a domain/entity model. Either rename it to Domain Model / Entity Class Diagram, or create a separate backend class diagram with controllers, services, repositories, DTOs, middleware, and entities.

Also update architecture diagrams to follow the AWS/AWS Educate direction: EC2, RDS PostgreSQL, S3, IAM, CloudWatch, GitHub Actions, Docker or PM2, and Nginx. Avoid Supabase/Render/Railway as the main deployment architecture.
```
