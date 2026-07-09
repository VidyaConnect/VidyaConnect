# Story 3: Set Up Local PostgreSQL Structure

## Goal

Prepare local database setup for the microservices foundation.

## Tasks

- Create local PostgreSQL container.
- Create Keycloak database separately.
- Create app databases or schemas.
- Decide ownership per service.
- Add migration approach.
- Add seed data for one school.
- Add seed users/classes for testing.
- Document local DB setup.

## Acceptance Criteria

- Local PostgreSQL starts with Docker Compose.
- Keycloak has a separate database or schema.
- Application services have a clear database/schema ownership approach.
- Migrations can run locally.
- Seed data is available for the first vertical slice.

## Suggested Labels

`story`, `database`, `postgresql`, `foundation`

