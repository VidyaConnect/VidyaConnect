# Story 5: Implement JWT Validation and Tenant Context

## Goal

Backend services validate Keycloak-issued tokens and extract authenticated user and tenant context.

## Tasks

- Validate JWT using Keycloak JWKS.
- Extract user id.
- Extract role.
- Extract `school_id` or tenant context.
- Attach auth context to request.
- Return `401` for missing/invalid token.
- Return `403` for insufficient role.
- Add manual test steps.
- Reuse middleware across services where practical.

## Acceptance Criteria

- Protected endpoint rejects missing token.
- Protected endpoint rejects invalid token.
- Protected endpoint accepts valid Keycloak token.
- Request context includes `userId`, `role`, and `school_id` or documented tenant context.
- Insufficient role returns `403`.

## Suggested Labels

`story`, `auth`, `backend`, `tenant-isolation`

