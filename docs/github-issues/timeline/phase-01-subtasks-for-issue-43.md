# Phase 1 Subtasks for Issue #43 - Foundation Setup

Parent issue: https://github.com/VidyaConnect/VidyaConnect/issues/43

Use these as child issues or as a task checklist under Issue #43.  
Recommended: create them as separate issues so each student can assign themselves clearly.

## Subtask 1: Review and Align Phase 1 Scope

**Goal:** Ensure all team members understand what Phase 1 must deliver.

**Tasks:**
- Read the mid-September delivery plan.
- Read the local environment setup guide.
- Read the technical direction summary.
- Confirm Phase 1 scope with the team.
- Identify which items are must-have for Phase 1.

**Acceptance Criteria:**
- Team agrees on Phase 1 scope.
- Any unclear scope item is documented as a question.
- Each team member understands their likely workstream.

**Suggested labels:** `task`, `phase-1`, `planning`

---

## Subtask 2: Create Initial Repository Structure

**Goal:** Create the folder structure needed for microservices, frontend apps, and infrastructure.

**Tasks:**
- Create `services/`.
- Create `web-admin/`.
- Create `mobile-app/`.
- Create `infra/`.
- Create `infra/docker/`.
- Create `infra/nginx/`.
- Create `infra/keycloak/`.
- Create `infra/observability/`.
- Add placeholder README files where needed.

**Acceptance Criteria:**
- Repo structure is clear.
- Empty folders are preserved with `.gitkeep` or README files.
- Team can identify where each type of work belongs.

**Suggested labels:** `task`, `phase-1`, `repo-structure`

---

## Subtask 3: Create Docker Compose Local Skeleton

**Goal:** Create the first local Docker Compose file.

**Tasks:**
- Create `docker-compose.local.yml`.
- Add PostgreSQL service placeholder.
- Add Keycloak service placeholder.
- Add Nginx service placeholder.
- Add LocalStack service placeholder.
- Add placeholder backend service entries if service Dockerfiles exist.
- Add comments for future Grafana/OpenTelemetry services.

**Acceptance Criteria:**
- `docker-compose.local.yml` exists.
- File is readable and documented.
- Team can run Docker Compose even if some app services are still placeholders.

**Suggested labels:** `task`, `phase-1`, `devops`, `docker`

---

## Subtask 4: Add Local Environment Variable Templates

**Goal:** Provide safe example environment files for local development.

**Tasks:**
- Add root `.env.example`.
- Add service-level `.env.example` templates where applicable.
- Add `web-admin/.env.example`.
- Add `mobile-app/.env.example`.
- Add comments explaining required values.
- Ensure no real secrets are committed.

**Acceptance Criteria:**
- Example env files exist.
- No real credentials are committed.
- New developer can see what values are required.

**Suggested labels:** `task`, `phase-1`, `devops`, `configuration`

---

## Subtask 5: Configure Local PostgreSQL Container

**Goal:** Run PostgreSQL locally for application and Keycloak data.

**Tasks:**
- Add PostgreSQL container to Docker Compose.
- Define database name/user/password through env variables.
- Create separate database/schema plan for Keycloak and app services.
- Document connection details.
- Verify PostgreSQL starts locally.

**Acceptance Criteria:**
- PostgreSQL container starts successfully.
- Connection details are documented.
- Keycloak/app database separation approach is documented.

**Suggested labels:** `task`, `phase-1`, `database`, `postgresql`

---

## Subtask 6: Configure Local Keycloak Container

**Goal:** Run Keycloak locally as the Identity Provider.

**Tasks:**
- Add Keycloak container to Docker Compose.
- Connect Keycloak to local PostgreSQL.
- Create initial admin credentials through env variables.
- Confirm Keycloak admin console is accessible.
- Document local Keycloak URL and startup steps.

**Acceptance Criteria:**
- Keycloak starts locally.
- Admin console is accessible.
- Keycloak uses PostgreSQL instead of only temporary in-memory data.

**Suggested labels:** `task`, `phase-1`, `auth`, `keycloak`

---

## Subtask 7: Create Keycloak Realm, Clients, and Roles

**Goal:** Prepare Keycloak for VidyaConnect authentication.

**Tasks:**
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
- Create sample users.
- Export realm config to `infra/keycloak/realm-export.json`.

**Acceptance Criteria:**
- Sample users can log in.
- Roles are available in token/claims or documented.
- Realm export exists and contains no real secrets.

**Suggested labels:** `task`, `phase-1`, `auth`, `keycloak`

---

## Subtask 8: Configure Local Nginx Routing Skeleton

**Goal:** Prepare local reverse proxy routing.

**Tasks:**
- Add Nginx container to Docker Compose.
- Add local Nginx config under `infra/nginx/`.
- Route `/auth` to Keycloak.
- Reserve `/api/v1/...` routes for backend services.
- Route `/` to web-admin when available.

**Acceptance Criteria:**
- Nginx starts locally.
- Nginx config is committed.
- Planned route structure is documented.

**Suggested labels:** `task`, `phase-1`, `nginx`, `devops`

---

## Subtask 9: Add LocalStack Container for AWS Simulation

**Goal:** Prepare local AWS-like development services.

**Tasks:**
- Add LocalStack container to Docker Compose.
- Enable S3 service for foundation work.
- Document local endpoint and credentials.
- Add placeholder bucket creation notes/script.

**Acceptance Criteria:**
- LocalStack starts locally.
- Local S3 endpoint is documented.
- Team understands LocalStack is for local development only.

**Suggested labels:** `task`, `phase-1`, `localstack`, `s3`

---

## Subtask 10: Create Backend Service Health Check Skeleton

**Goal:** Create at least one backend service skeleton with health endpoint.

**Tasks:**
- Create first backend service skeleton.
- Add `/health` endpoint.
- Add basic structured logging.
- Add Dockerfile.
- Add service README.

**Acceptance Criteria:**
- Service runs locally.
- `/health` returns success.
- Service can be containerized.

**Suggested labels:** `task`, `phase-1`, `backend`, `microservices`

---

## Subtask 11: Create API Contracts v1 Draft

**Goal:** Start API design before parallel frontend/backend implementation.

**Tasks:**
- Create `docs/api/api-contracts.md`.
- Define common API rules.
- Define auth header format.
- Define error response format.
- Define tenant rule.
- Add initial contracts for:
  - auth/profile
  - schools/users/classes
  - announcements
  - attendance
  - files

**Acceptance Criteria:**
- API contracts document exists.
- Each endpoint includes owning service, roles, tenant rule, request, response, and errors.
- Team reviews the draft.

**Suggested labels:** `task`, `phase-1`, `api-contracts`, `documentation`

---

## Subtask 12: Create Web/Admin UI Shell

**Goal:** Create the first web/admin app shell for Phase 1.

**Tasks:**
- Create or organize `web-admin` project folder.
- Add base layout.
- Add login placeholder.
- Add dashboard placeholder.
- Add navigation placeholders for foundation modules.

**Acceptance Criteria:**
- Web/admin app shell exists.
- Main navigation is visible.
- Future screens have clear placeholders.

**Suggested labels:** `task`, `phase-1`, `web-admin`, `ui`

---

## Subtask 13: Create Mobile App UI Shell

**Goal:** Create the first mobile app shell for Phase 1.

**Tasks:**
- Create or organize `mobile-app` project folder.
- Add navigation structure.
- Add login placeholder.
- Add parent dashboard placeholder.
- Add student/announcement/attendance placeholders.

**Acceptance Criteria:**
- Mobile app shell exists.
- Main navigation is visible.
- Placeholder screens exist for core flows.

**Suggested labels:** `task`, `phase-1`, `mobile`, `ui`

---

## Subtask 14: Document Local Startup Steps

**Goal:** Make local setup repeatable for all students.

**Tasks:**
- Add local startup section to README or devops docs.
- Document prerequisites.
- Document Docker Compose command.
- Document local URLs.
- Document basic troubleshooting notes.

**Acceptance Criteria:**
- A student can follow the guide and start the local environment.
- Key local URLs are listed.
- Common errors are documented.

**Suggested labels:** `task`, `phase-1`, `documentation`, `local-env`

---

## Subtask 15: Phase 1 Review and Evidence Collection

**Goal:** Prepare evidence for logbooks and interim review.

**Tasks:**
- Confirm completed Phase 1 tasks.
- Ensure each student has assigned issues.
- Ensure each student has evidence links.
- Capture screenshots of local environment.
- Capture screenshots of Keycloak/PostgreSQL/Nginx where useful.
- Update GitHub project board.

**Acceptance Criteria:**
- Phase 1 progress is visible in GitHub.
- Each student has individual evidence.
- Team can explain what is complete and what remains.

**Suggested labels:** `task`, `phase-1`, `evidence`, `review`

