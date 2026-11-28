
---

# `services/consent-form-service/README.md`

```md
# Consent Form Service

## Overview

The Consent Form Service manages digital consent forms and approval workflows within VidyaConnect.

## Responsibilities

- Create consent forms
- Manage parent approvals
- Track consent status
- Provide consent-related APIs
- Maintain consent records

## Technology Stack

- Node.js
- Express.js
- Docker
- REST API

## Running Locally

Install dependencies:

```

The local Docker Compose environment runs Prisma generation and migrations before
starting this service. The service exposes authenticated consent endpoints under
`/api/consent-forms`:

- `GET /` and `GET /:id` for teacher-owned or school-scoped staff views
- `POST /` for teacher class-scoped or school-admin school-scoped drafts
- `PATCH /:id` for draft updates
- `POST /:id/publish` and `POST /:id/close` for lifecycle transitions
- `GET /:id/responses` for authorised staff response monitoring
- `POST /:id/response` for parent responses

Teachers are restricted to their assigned class. School admins are restricted
to their own school. Parent responses are restricted to students linked to the
authenticated parent, and duplicate responses are rejected.bash
npm install