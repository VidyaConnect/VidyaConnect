# Database Ownership

Postgres runs as a single local server, hosting two separate databases:

| Database | Purpose | Managed by |
|---|---|---|
| vidyaconnect_db | Core application data — schools, users, classes, announcements, assignments, attendance, etc. | Backend service (Prisma) |
| keycloak_db | Identity provider internal storage — auth credentials, sessions, realms | Keycloak (Identity module) |

## Rules
- The backend application only ever connects to vidyaconnect_db. It never reads or writes to keycloak_db.
- Keycloak only ever connects to keycloak_db. It has no knowledge of the application's tables.
- Each database has its own dedicated Postgres user, enforcing this separation at the permission level, not just convention.
- All changes to vidyaconnect_db's structure go through Prisma migrations. Keycloak manages its own schema internally.