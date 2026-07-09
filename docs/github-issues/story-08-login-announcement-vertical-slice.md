# Story 8: Build Login + Announcement Vertical Slice

## Goal

Prove frontend, backend, Keycloak, database, and tenant isolation work end to end.

## Tasks

- Implement `announcement-service`.
- Add announcement table/schema.
- Add create announcement endpoint.
- Add list announcements endpoint.
- Enforce `school_id` filtering.
- Add audit log for announcement creation.
- Add web-admin login using Keycloak.
- Add web-admin create announcement screen.
- Add mobile login placeholder or test client.
- Add mobile/view announcement screen if ready.

## Acceptance Criteria

- School Admin or Teacher can create an announcement.
- Parent/Student can view relevant announcements.
- Users cannot see announcements from another school.
- Announcement creation records audit log entry.
- End-to-end flow works locally through Docker Compose.

## Suggested Labels

`story`, `vertical-slice`, `announcements`, `foundation`

