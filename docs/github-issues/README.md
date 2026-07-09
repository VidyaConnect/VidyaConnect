# GitHub Issue Drafts

This folder contains draft GitHub issues for the first VidyaConnect implementation work.

These files are not the implementation itself. They are issue templates that can be reviewed, edited, and then created in GitHub.

## Recommended First Batch

Create these first:

1. `story-01-local-docker-compose.md`
2. `story-02-keycloak-local-idp.md`
3. `story-03-local-postgresql-structure.md`
4. `story-04-backend-microservices-skeleton.md`
5. `story-05-jwt-validation-tenant-context.md`
6. `story-07-api-contracts-v1.md`
7. `story-08-login-announcement-vertical-slice.md`

## Optional Automation

After reviewing the issue files, issues can be created with GitHub CLI:

```powershell
gh auth login
.\docs\github-issues\create-issues.ps1
```

The script is intentionally simple and should be reviewed before running.

