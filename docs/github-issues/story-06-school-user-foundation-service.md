# Story 6: Implement School/User Foundation Service

## Goal

Provide basic school, user, class, student, teacher, and parent context for tenant-aware features.

## Tasks

- Add school-user-service migrations.
- Add `School` entity/table.
- Add user profile mapping to Keycloak user id.
- Add Student basics.
- Add Teacher basics.
- Add Parent/Guardian basics.
- Add Class basics.
- Add current user profile endpoint.
- Add current school context endpoint.
- Enforce `school_id` filtering.

## Acceptance Criteria

- Authenticated user can fetch their own profile.
- User sees only their school context.
- Cross-school access returns `403`.
- Seed data supports first vertical slice.

## Suggested Labels

`story`, `backend`, `school-user-service`, `tenant-isolation`

