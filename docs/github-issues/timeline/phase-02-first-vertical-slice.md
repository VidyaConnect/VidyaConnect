# Phase 2: First Vertical Slice - Login and Announcements

## Target Dates

2026-07-22 to 2026-08-04

## Goal

Prove that authentication, tenant context, backend service integration, database access, and frontend integration work end to end.

## Tasks

- Implement Keycloak login flow.
- Implement JWT validation.
- Extract role and `school_id` / tenant context.
- Implement school/user profile endpoint.
- Implement announcement-service.
- Add announcement schema/table.
- Add create announcement endpoint.
- Add list announcements endpoint.
- Add web/admin create announcement UI.
- Add mobile announcement feed UI.
- Enforce school-level filtering.
- Add basic audit log for announcement creation.

## Acceptance Criteria

- User can log in.
- System identifies user role and school.
- School Admin/Teacher can create an announcement.
- Parent/Student can view relevant announcements.
- User cannot view announcements from another school.
- Demo flow works locally through Docker Compose.

## Suggested Labels

`phase`, `vertical-slice`, `announcements`, `foundation`

