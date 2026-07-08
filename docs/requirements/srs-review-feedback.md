# VidyaConnect SRS Review Feedback

Reviewer: Ishan Liyanage  
Focus: SRS consistency, scope, multi-tenancy, architecture alignment, DevOps direction, NFRs, and implementation readiness

## Overall Assessment

The team has made strong progress by preparing and uploading the SRS, proposal, architecture diagram, context diagram, use case diagram, EER diagram, class diagram, and Figma UI designs.

However, the SRS is not fully consistent yet. The biggest issue is not missing content. The biggest issue is that the document contains too much content and mixes MVP, extended scope, and future scope across many sections.

The SRS should now be cleaned up so that all artifacts agree with the same product direction. Since this is a one-year university project, the MVP should be treated as the first stable foundation, not as the entire final-year delivery. Additional features can still be planned as extended scope after the foundation is stable.

## Main Feedback Summary

- The SRS is detailed, but too broad.
- VidyaConnect appears to be designed as a multi-tenant platform, but this must be stated clearly.
- Scope classification must be cleaned up across the whole document.
- MVP, extended scope, and future scope must not be mixed.
- DevOps references must be updated to match the current learning direction: AWS / AWS Educate.
- Architecture document is currently incomplete and should be expanded separately.
- NFRs are useful but need more structure and alignment with the architecture.
- Observability should be added as a formal section.
- Diagrams should be checked against the final SRS scope.

## 1. Multi-Tenancy Must Be Made Explicit

The SRS already suggests that VidyaConnect is intended to be multi-tenant:

- Super Admin can onboard/register schools.
- School Admin belongs to one school.
- The SRS mentions cross-school access restrictions.
- It mentions school-scope filtering.
- It mentions that one school's data must not be accessible to another school.
- It mentions multi-school support.

This means the intended model is:

> One hosted VidyaConnect platform supports multiple schools. Each school is a tenant, and each tenant's data must be isolated from other schools.

This should be stated clearly in the SRS.

### Required Fix

Add a new section:

```text
Multi-Tenancy Model
```

Suggested content:

```text
VidyaConnect will be hosted as a single platform that supports multiple schools. Each school acts as a tenant. Users, students, classes, announcements, assignments, attendance records, consent forms, notifications, reports, and audit logs must be scoped to a school.

A Super Admin can manage platform-level configuration and onboard schools. A School Admin can manage only their own school. Teachers can access only assigned classes within their school. Parents/Guardians can access only linked children. Students can access only their own records.

All API requests and database queries must enforce school-level filtering to prevent cross-school data access.
```

## 2. Add `school_id` / Tenant Scope To Core Entities

The SRS should clearly define which entities are school-scoped.

Core entities should include direct or indirect school-level scope.

Examples:

- `School`
- `User`
- `Teacher`
- `Student`
- `ParentGuardian`
- `Class`
- `Subject`
- `Announcement`
- `Assignment`
- `AttendanceRecord`
- `AbsenceJustification`
- `ConsentForm`
- `ConsentResponse`
- `Notification`
- `AuditLog`
- `BulkUploadLog`

Some junction tables may inherit school context indirectly, but the rule must be clear:

> Every record that belongs to a school must be isolated by school scope.

### Required Fix

Update the data requirements and EER explanation to include:

```text
Tenant isolation:
All school-specific records must either contain school_id directly or be linked to a parent entity that contains school_id. The service layer must enforce school-scoped access for every request.
```

## 3. Add Clear School-Level Access Rules

The SRS should include explicit access rules.

Suggested rules:

```text
- A Super Admin may access platform-level configuration and school onboarding records.
- A Super Admin may view cross-school operational metadata but should not casually access student records unless required for support/audit.
- A School Admin may access only users, classes, students, announcements, forms, attendance, and reports belonging to their school.
- A Teacher may access only classes and students assigned to them within their school.
- A Parent/Guardian may access only children linked to their account.
- A Student may access only their own records.
- Every API request must enforce role-based and school-based access checks.
- Any cross-school access attempt must return 403 Forbidden and be logged as a security event.
```

## 4. Scope Classification Must Be Cleaned Up

The SRS currently includes many features:

- Communication Hub
- Assignments
- Notifications
- Consent Forms
- Attendance
- Calendar
- Dashboards
- Bulk Data
- School Notice Board
- Student Progress and Academic Records
- Parent-Teacher Meeting Scheduler
- School Community and Engagement
- Staff Directory
- AI Assistant / RAG
- Calendar export
- Assignment marking
- Health/safety references

This is too broad unless the scope classification is enforced consistently.

### Required Fix

Create one authoritative scope table:

```text
Core MVP / Foundation Scope
Extended Scope
Future Scope
```

Then ensure every functional requirement, use case, diagram, Figma screen, acceptance criterion, and architecture reference follows that table.

## 5. Recommended Scope Structure

### Core MVP / Foundation Scope

The Core MVP / Foundation Scope should include features needed to demonstrate the main product value:

- Authentication and RBAC
- Multi-school / tenant-aware user management
- School/class/student/parent/teacher management
- Communication Hub: school-wide and class-level announcements
- Assignment tracking
- Digital consent forms
- Attendance marking and absence response
- Basic smart notifications
- Basic role-based dashboards
- Basic bulk user/class import, if needed for onboarding

### Extended Scope

These can be added after the core MVP is stable:

- Calendar and event management
- Improved notification preferences
- Bulk import/export improvements
- Insights dashboard improvements
- Student submission and marking
- Student progress summary
- Parent-teacher meeting scheduler
- School notice board/archive
- Multilingual UI improvements
- Audit log review UI
- Deployment hardening

### Future Scope

These should not be treated as required delivery unless separately approved:

- AI Assistant / RAG
- LMS integration
- Library management
- Payment features
- Advanced analytics
- Full offline-first sync
- Complex community/social features
- Health records
- Discipline records

## 6. Remove Future Features From MVP Acceptance Criteria

The SRS currently includes some future/advanced functionality inside MVP acceptance criteria.

Examples to review:

- Calendar export to Google/Apple Calendar
- One-to-one messaging
- Advanced reports
- Assignment marking
- Student progress records
- AI/RAG references
- Health/safety references

### Required Fix

MVP acceptance criteria should only validate Core MVP / Foundation Scope features.

For example:

```text
MVP Attendance Acceptance Criteria:
- Teacher can select class and date.
- Teacher can mark students as Present, Absent, or Late.
- Parent/Guardian receives a notification when a child is marked absent.
- Parent/Guardian can submit an absence reason.
- Parent/Guardian can optionally upload a medical certificate or letter.
- Teacher/Admin can view the submitted reason/document.
- Attendance history is visible to relevant roles.
```

## 7. DevOps Direction Must Be Updated

The SRS currently references:

- Render
- Railway
- Supabase Storage

The current mentor direction is that this is a student project and students should learn deployment from scratch rather than relying on very easy managed platforms.

### Required Fix

Update DevOps and deployment references toward AWS / AWS Educate:

- Backend hosting: AWS EC2
- Database: AWS RDS PostgreSQL
- File storage: AWS S3
- Monitoring/logs: AWS CloudWatch
- Access control: AWS IAM
- CI/CD: GitHub Actions
- Runtime: Docker or PM2
- Reverse proxy: Nginx

### Suggested SRS wording

```text
VidyaConnect will explore AWS / AWS Educate for deployment to support student learning in practical DevOps. The preferred deployment architecture includes EC2 for backend hosting, RDS PostgreSQL for database hosting, S3 for uploaded files, IAM for access control, CloudWatch for logs/monitoring, and GitHub Actions for CI/CD.
```

## 8. Architecture Document Is Still Missing

The current architecture markdown file mainly links to a diagram. It is not yet a full architecture document.

The team should create:

```text
docs/architecture/architecture-document.md
```

It should include:

- Architecture overview
- Architecture goals
- C4 diagrams
- Technology stack
- Backend architecture
- Core modules
- Data architecture
- Security architecture
- NFR mapping
- Observability
- Deployment architecture
- Key architecture decisions
- Risks and mitigations

## 9. C4 Diagrams Should Be Added

The team should create:

- C1: System Context Diagram
- C2: Container Diagram
- C3: Component Diagram
- Optional C4: module-level/code-level diagram for one important module such as Attendance

### C1 Should Show

- VidyaConnect system boundary
- Parent/Guardian
- Teacher
- School Admin
- Student
- Super Admin
- External systems such as FCM, AWS services, email/SMS if applicable

### C2 Should Show

- React Native mobile app
- Next.js web portal
- Node.js/Express backend API
- PostgreSQL database
- S3 file storage
- FCM notification service
- CloudWatch/logging

### C3 Should Show

- API/controller layer
- Auth/RBAC middleware
- Service/business layer
- Repository/data access layer
- User/Admin service
- Announcement service
- Assignment service
- Consent service
- Attendance service
- Notification service
- Audit/logging service

## 10. NFRs Need Better Structure

The SRS has NFRs, but they should be reviewed and made more measurable.

For each NFR, use this format:

```text
Quality Attribute:
Why it matters:
Requirement:
Measurement / Acceptance Criteria:
Design Approach:
```

Important NFRs for VidyaConnect:

- Usability
- Accessibility
- Performance
- Scalability
- Availability
- Reliability
- Security
- Privacy
- Maintainability
- Testability
- Observability
- Localization
- Backup and recovery
- Data integrity
- Auditability
- Extensibility

## 11. Observability Should Be A Formal Section

The SRS mentions logs and audit logs in places, but observability should be formalized.

Add:

```text
Observability Requirements
```

Cover:

- Application logs
- Error tracking
- Audit logs
- Metrics
- Health checks
- Monitoring dashboard
- Alerting, future

### Example Observability Requirements

```text
OBS-001: Health Check Endpoint
The backend shall expose a GET /health endpoint to verify that the API is running.

OBS-002: Audit Logs
The system shall record audit logs for sensitive actions such as attendance edits, consent submissions, role changes, user deactivation, and file uploads.

OBS-003: Sensitive Data Logging Restriction
The system shall not log passwords, JWT tokens, uploaded document contents, or sensitive student information.
```

## 12. Privacy And Legal Wording Should Be Corrected

The SRS should avoid saying that Sri Lanka has no fully enforced data protection law as a reason to apply GDPR-like practices.

Use safer wording:

```text
The system should be designed in alignment with Sri Lanka's Personal Data Protection Act and child-data privacy best practices. Legal obligations must be verified before any real school pilot.
```

Also remove casual references to health records unless they are truly in scope.

## 13. Diagrams Must Match Final Scope

The diagrams are useful, but they need consistency cleanup.

### Context Diagram

Issues:

- It includes hosting/Supabase/CI pipeline details that may belong more in C2/deployment diagrams.
- It should focus on external actors and systems.
- It should use AWS/S3 if that is the final DevOps direction.

### Use Case Diagram

Issues:

- It is crowded.
- It mixes MVP, extended, and future features.
- It includes community, messaging, marks, and other advanced items.

Recommended fix:

- Create one MVP use case diagram.
- Optionally create a separate extended/future use case diagram.

### EER Diagram

Issues:

- It is comprehensive but very dense.
- It should clearly show tenant/school isolation.
- Ensure `school_id` or school-scoped relationships are explicit.

Recommended fix:

- Create a simplified MVP EER view.
- Keep the full EER as an extended/full-system view.

### Class Diagram

Issues:

- It looks closer to database/entity classes than application architecture classes.
- It should be clear whether it represents domain entities, backend classes, or service/controller architecture.

Recommended fix:

- Either rename it to Domain Model / Entity Class Diagram,
- or add service/controller/repository classes if it is meant to represent backend design.

## 14. Role And Permission Consistency

The SRS should consistently use the same role names:

- Super Admin
- School Admin
- Teacher
- Parent/Guardian
- Student

Avoid alternate terms like:

- Administrator
- School Moderator
- Moderator

unless they are formally defined.

## 15. AI Assistant / RAG Should Be Reduced Or Moved Clearly To Future Scope

The SRS currently contains many AI/RAG references across:

- Introduction
- Product overview
- User permissions
- Architecture
- Data/privacy risks
- Business rules

If AI is Future Scope, it should not appear as if it is part of current implementation.

### Required Fix

- Keep AI only in Future Scope.
- Remove it from MVP permissions.
- Remove AI services from core architecture.
- Remove AI acceptance criteria.
- Keep a short future-scope note only.

## 16. Health Records / Health Data Should Be Removed Unless Explicitly In Scope

The SRS still contains references to:

- health records
- health details
- health/safety alerts
- medical information

Attendance-related medical certificate uploads are acceptable, but full health records are not.

### Required Fix

Keep:

- absence letter / medical certificate upload for attendance justification

Remove or future-scope:

- student health records
- vaccination records
- health module
- health summaries
- general health information access

## 17. Calendar Should Be Scoped Carefully

Calendar is useful, but calendar export/sync is more complex.

Recommended split:

### Core / MVP

- In-app school events
- In-app class events
- Upcoming event visibility

### Extended

- Event reminders
- Exam timetable
- Conflict warnings

### Future

- Google Calendar / Apple Calendar export
- Two-way sync

## 18. Messaging Should Be Scoped Carefully

The SRS includes one-to-one messages and community/group messaging.

This can become large and operationally difficult.

Recommended split:

### Core / MVP

- School-wide announcements
- Class-level announcements
- Read receipts / acknowledgement if needed

### Extended

- Limited structured parent-teacher messaging
- Message categories
- Teacher availability windows

### Future

- Community groups
- Rich group messaging
- Social-style reactions
- Suggestion boxes

## 19. Bulk Data Management Should Be Narrowed

Bulk import is useful for onboarding schools, but full bulk export/import across every module is large.

Recommended split:

### Core / MVP

- Bulk import users/students/classes/parents/teachers for initial setup
- Validation error report

### Extended

- Bulk export attendance/consent reports
- Bulk update users/classes

### Future

- Exam marks import
- Full module exports
- Advanced reporting

## 20. Final Priority Fix List

The students should prioritize these fixes:

1. Add explicit Multi-Tenancy Model section.
2. Define `school_id` / tenant scoping for core entities.
3. Add school-level access rules.
4. Create one authoritative scope classification table.
5. Remove future-scope items from MVP acceptance criteria.
6. Move AI/RAG references mostly to Future Scope.
7. Remove full health-record references unless explicitly future-scoped.
8. Update DevOps references from Render/Railway/Supabase to AWS/AWS Educate direction.
9. Add formal Observability section.
10. Convert architecture markdown into a proper architecture document.
11. Add C1/C2/C3 diagrams.
12. Split diagrams into MVP view and full-system/extended view if needed.
13. Ensure SRS, diagrams, Figma, and GitHub issues all use the same scope.

## Suggested Message To Team

```text
Good progress on the SRS and documentation. The document is detailed, but it now needs consistency cleanup.

The most important fix is to clearly define VidyaConnect as a multi-tenant platform: one hosted system supporting multiple schools, with strict school-level data isolation.

Please add a Multi-Tenancy Model section, define school_id / tenant scoping for core entities, and make school-level access control explicit across requirements, data model, and business rules.

Also clean up scope classification. The SRS currently mixes Core MVP, Extended Scope, and Future Scope features across functional requirements, use cases, architecture, and acceptance criteria. Create one authoritative scope table and make every section follow it.

Finally, update DevOps references to match the current project direction: AWS / AWS Educate, EC2, RDS PostgreSQL, S3, IAM, CloudWatch, GitHub Actions, Docker or PM2, and Nginx. Avoid relying on Render, Railway, or Supabase as the main deployment path.
```
