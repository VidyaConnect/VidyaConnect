# Migration Approach

We use **Prisma Migrate** for all schema changes to `vidyaconnect_db`.

## Rules
1. Never edit the database manually with raw SQL for schema changes.
2. All changes start in `prisma/schema.prisma`.
3. Run `npx prisma migrate dev --name <short-description>` to generate and apply a migration locally.
4. Commit the generated migration folder in `prisma/migrations/` — it must be reviewed in the PR.
5. On a fresh machine or after pulling new migrations, run:

6. Never run `prisma migrate reset` on a shared/staging database — local only.

## Naming convention
`<verb>_<entity>`, e.g. `add_consent_form_table`, `add_email_index_to_users`.

## Scope
This approach applies only to `vidyaconnect_db`. Keycloak manages its own schema internally and is not part of this migration process.