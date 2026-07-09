# Story 1: Set Up Local Docker Compose Environment

## Goal

Run the foundation VidyaConnect platform locally on student laptops before AWS deployment.

## Background

The team should first prove the platform works locally using Docker Compose. Nothing should be treated as ready for AWS until it can run locally.

## Tasks

- Create `docker-compose.local.yml`.
- Add PostgreSQL container.
- Add Keycloak container.
- Add Nginx container.
- Add LocalStack container.
- Add placeholder backend service containers.
- Add web-admin container placeholder.
- Add `.env.example` files.
- Document local startup command.
- Verify containers start successfully.

## Acceptance Criteria

- `docker compose -f docker-compose.local.yml up` starts the core local services.
- Team can access Keycloak locally.
- Team can access PostgreSQL locally.
- Team can access Nginx locally.
- Local startup steps are documented.

## Suggested Labels

`story`, `devops`, `foundation`, `local-env`

