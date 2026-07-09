# Story 2: Configure Keycloak Local Identity Provider

## Goal

Use Keycloak for authentication instead of building custom username/password authentication.

## Tasks

- Create `VidyaConnect` realm.
- Create clients:
  - `mobile-app`
  - `web-admin`
  - `backend-services`
- Create roles:
  - `SUPER_ADMIN`
  - `SCHOOL_ADMIN`
  - `TEACHER`
  - `PARENT`
  - `STUDENT`
- Create sample users for each role.
- Add `school_id` claim strategy.
- Export realm config.
- Document sample login credentials for local development.

## Acceptance Criteria

- Sample users can log in through Keycloak.
- Keycloak issues JWT access tokens.
- Token includes role information.
- Token includes tenant/school context or a documented way to resolve it.
- Realm export exists and contains no real secrets.

## Suggested Labels

`story`, `auth`, `keycloak`, `foundation`

