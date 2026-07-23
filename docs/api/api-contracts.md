# VidyaConnect API Contracts v1

This document defines the official API contracts for the VidyaConnect platform microservices ecosystem.


## 1. Global Specifications & Architecture Rules

### 1.1 Base API Path

All routes are fronted by an API gateway and use the prefix:

/api/v1

Each microservice owns a distinct path namespace under this prefix (see §1.5).

### 1.2 Standard Success Response Format

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

### 1.3 Standard Error Response Format

```json
{
  "success": false,
  "message": "Error description goes here.",
  "data": {}
}
```

### 1.4 Common Error Semantics

These apply platform-wide. Each endpoint below only lists the ones relevant to it, plus any endpoint-specific 404/409 conditions.

| Status | Meaning | Typical trigger |
|---|---|---|
| 400 | Bad Request | Payload fails schema/field validation |
| 401 | Unauthorized | Missing, expired, or invalid Keycloak-issued JWT |
| 403 | Forbidden | Valid token, but role lacks permission **or** `school_id` in token does not match the resource's tenant |
| 404 | Not Found | Referenced entity (studentId, classId, formId, etc.) does not exist within the caller's tenant |
| 409 | Conflict | Duplicate entity, state already set, or a write conflicts with existing data |

### 1.5 Microservice Ownership Map

| Microservice | Owns |
|---|---|
| `school-user-service` | Schools, users, profiles, classes, subjects, teacher assignments, student profiles, parent-student relationships |
| `announcement-service` | School-wide and class-specific announcements |
| `attendance-service` | Attendance records, absence justifications |
| `consent-form-service` | Consent forms and parent responses |
| `file-service` | Pre-signed S3 upload/download URLs, file metadata |
| `notification-service` | Notification history and delivery |
| `community-service` | School and Class specific communities |


### 1.6 Multi-Tenancy Security Rules

- Each school is an isolated tenant, identified by `school_id`.
- Every authenticated request carries a Keycloak-issued JWT containing a `school_id` custom claim.
- Every state-changing (and most read) endpoint validates that the `school_id` on the target resource matches the `school_id` in the caller's JWT **before** touching the database — this check is enforced at the service layer, not just the gateway, since services may also be called internally.
- Cross-tenant references (e.g. a `classId` that belongs to a different school) are treated as **404 Not Found**, not 403 — this avoids confirming to a caller that a resource exists in another tenant.
- Nested ownership (e.g. a student belongs to a class, a class belongs to a school) is validated at every level of the chain, not just the outermost `school_id`.

### 1.7 Roles (Keycloak Realm Roles)

| Role | Notes |
|---|---|
| `SUPER_ADMIN` | Cross-tenant platform administrator. Not scoped to a single `school_id`. |
| `SCHOOL_ADMIN` | Full administrative rights within one school. Includes former "Principal" scope (see §0.2). |
| `TEACHER` | Scoped to classes/subjects they are assigned to within their school. |
| `PARENT` | Scoped to their own linked student(s) within their school. |
| `STUDENT` | Scoped to their own record within their school. |

---

## 2. Authentication (Keycloak / OIDC)

**Owning system:** Keycloak (not a VidyaConnect microservice). VidyaConnect does **not** implement custom login, token issuance, or password-reset endpoints.

### 2.1 Design decision

- Web clients use the **OIDC Authorization Code flow** (with PKCE) against Keycloak directly.
- Mobile/native clients use the same Authorization Code + PKCE flow via the system browser (no Direct Access Grant / Resource Owner Password flow, to avoid handling raw credentials in-app).
- Token refresh, logout, and password reset are all handled by Keycloak's standard endpoints (`/realms/{realm}/protocol/openid-connect/token`, `/.../logout`, and Keycloak's account/reset UI) — VidyaConnect services never see a password.
- Keycloak is configured with a custom protocol mapper so every issued access token includes a `school_id` claim alongside the standard realm roles.
- API gateway validates the JWT signature/expiry against Keycloak's JWKS endpoint on every request; downstream services trust the gateway-forwarded, already-validated token claims.

### 2.2 Sync Local Profile (post-login provisioning)

Since VidyaConnect still needs a local user record (for relationships, class assignments, etc.), the first successful Keycloak login triggers a sync call from the client.

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/users/sync` |
| Owning Service | `school-user-service` |
| Allowed Roles | Any authenticated Keycloak user |
| Tenant / Ownership Enforcement | Creates or updates the local profile using `sub` (Keycloak user id) and `school_id` from the JWT — caller cannot pass a different `school_id` in the body; body value is ignored in favor of the token claim. |

**Request**

```json
{
  "firstName": "Jane",
  "lastName": "Doe"
}
```

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Profile synced successfully.",
  "data": {
    "id": "USR10029",
    "keycloakId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Jane Doe",
    "email": "user@vidyaconnect.lk",
    "role": "TEACHER",
    "schoolId": "SCH001"
  }
}
```

**Error Responses**

| Status | Condition |
|---|---|
| 401 | Missing/invalid/expired JWT |
| 400 | Body fails validation (e.g. missing `firstName`) |

---

## 3. Foundation Endpoints — User Profile, Users, Classes

**Owning Microservice:** `school-user-service`

### 3.1 Get My Profile

| Property | Value |
|---|---|
| Method | GET |
| Endpoint | `/users/me` |
| Allowed Roles | Any authenticated user |
| Tenant / Ownership Enforcement | Returns only the caller's own record, resolved via `sub` claim; no `school_id` param accepted from the client. |

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Profile retrieved successfully.",
  "data": {
    "id": "USR10029",
    "name": "Jane Doe",
    "email": "user@vidyaconnect.lk",
    "role": "TEACHER",
    "schoolId": "SCH001"
  }
}
```

**Error Responses:** `401` (invalid/missing token), `404` (token valid but no local profile synced yet — client should call `/users/sync`)

### 3.2 Update My Profile

| Property | Value |
|---|---|
| Method | PUT |
| Endpoint | `/users/me` |
| Allowed Roles | Any authenticated user |
| Tenant / Ownership Enforcement | Caller may only update their own record; `schoolId` and `role` are read-only fields on this endpoint (managed via Keycloak/admin flows, not self-service). |

**Request**

```json
{
  "firstName": "Jane",
  "lastName": "Silva",
  "contactNumber": "+94771234567"
}
```

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Profile updated successfully.",
  "data": {}
}
```

**Error Responses:** `400` (validation), `401`

### 3.3 List Users in School

| Property | Value |
|---|---|
| Method | GET |
| Endpoint | `/users?role=&classId=` |
| Allowed Roles | `SCHOOL_ADMIN` |
| Tenant / Ownership Enforcement | Query is always implicitly scoped to `schoolId` from the JWT; `classId` filter (if present) is validated to belong to the same school before filtering, otherwise treated as no match. |

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Users retrieved successfully.",
  "data": [
    { "id": "USR10029", "name": "Jane Doe", "role": "TEACHER" }
  ]
}
```

**Error Responses:** `401`, `403` (caller is not `SCHOOL_ADMIN`)

### 3.4 Create Class

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/classes` |
| Allowed Roles | `SCHOOL_ADMIN` |
| Tenant / Ownership Enforcement | New class is created with `schoolId` taken from the JWT, never from the request body. |

**Request**

```json
{
  "name": "Grade 10 - A",
  "gradeLevel": 10
}
```

**Success Response (201 Created)**

```json
{
  "success": true,
  "message": "Class created successfully.",
  "data": {
    "classId": "CLS001"
  }
}
```

**Error Responses:** `400`, `401`, `403`, `409` (a class with the same name already exists in this school)

### 3.5 List Classes

| Property | Value |
|---|---|
| Method | GET |
| Endpoint | `/classes` |
| Allowed Roles | `SCHOOL_ADMIN`, `TEACHER` |
| Tenant / Ownership Enforcement | Scoped to `schoolId` from JWT. `TEACHER` additionally sees only classes they are assigned to (via §4.3 assignment records); `SCHOOL_ADMIN` sees all classes in the school. |

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Classes retrieved successfully.",
  "data": [
    { "id": "CLS001", "name": "Grade 10 - A", "gradeLevel": 10 }
  ]
}
```

**Error Responses:** `401`, `403`

---

## 4. Core School Operations

**Owning Microservice:** `school-user-service`

### 4.1 Create New School

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/schools` |
| Allowed Roles | `SUPER_ADMIN` |
| Tenant / Ownership Enforcement | Not tenant-scoped — this endpoint *creates* the isolation boundary. Restricted to `SUPER_ADMIN` precisely because it sits outside normal tenant checks. |

**Request**

```json
{
  "name": "Ananda College",
  "address": "Colombo 10, Sri Lanka",
  "contactNumber": "+94112345678",
  "domain": "anandacollege.lk"
}
```

**Success Response (201 Created)**

```json
{
  "success": true,
  "message": "School entity provisioned successfully.",
  "data": {
    "schoolId": "SCH001"
  }
}
```

**Error Responses:** `400` (validation), `401`, `403` (caller is not `SUPER_ADMIN`), `409` (domain already registered)

### 4.2 Create Subject

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/subjects` |
| Allowed Roles | `SCHOOL_ADMIN` |
| Tenant / Ownership Enforcement | Subject is created under the caller's `schoolId` (from JWT). |

**Request**

```json
{
  "name": "Mathematics",
  "code": "MATH10"
}
```

**Success Response (201 Created)**

```json
{
  "success": true,
  "message": "Subject created successfully.",
  "data": {
    "subjectId": "SUB991"
  }
}
```

**Error Responses:** `400`, `401`, `403`, `409` (duplicate subject code in this school)

### 4.3 Assign Teacher to Subject

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/subjects/assign` |
| Allowed Roles | `SCHOOL_ADMIN` |
| Tenant / Ownership Enforcement | `teacherId`, `subjectId`, and `classId` must all resolve to the caller's `schoolId`; if any belongs to another school, respond `404` for that field rather than confirming its existence elsewhere. |

**Request**

```json
{
  "teacherId": "TCH005",
  "subjectId": "SUB991",
  "classId": "CLS001"
}
```

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Academic assignment verified and logged.",
  "data": {}
}
```

**Error Responses:** `400`, `401`, `403`, `404` (teacherId/subjectId/classId not found in caller's school), `409` (assignment already exists)

---

## 5. Student & Parent Relationships

**Owning Microservice:** `school-user-service`

### 5.1 Create Student Profile

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/students` |
| Allowed Roles | `SCHOOL_ADMIN` |
| Tenant / Ownership Enforcement | `classId` must belong to the caller's `schoolId`; new student record is stamped with that same `schoolId`. |

**Request**

```json
{
  "firstName": "Arjun",
  "lastName": "Perera",
  "dateOfBirth": "2011-05-14",
  "classId": "CLS001"
}
```

**Success Response (201 Created)**

```json
{
  "success": true,
  "message": "Student profile instantiated successfully.",
  "data": {
    "studentId": "STU001"
  }
}
```

**Error Responses:** `400`, `401`, `403`, `404` (classId not found in caller's school), `409` (duplicate student record, e.g. re-submission)

### 5.2 Link Parent to Student

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/relationships/parent-student` |
| Allowed Roles | `SCHOOL_ADMIN` |
| Tenant / Ownership Enforcement | Both `parentId` and `studentId` must resolve to the caller's `schoolId`. |

**Request**

```json
{
  "parentId": "PRN441",
  "studentId": "STU001",
  "relationshipType": "FATHER"
}
```

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Parent-student relationship linked successfully.",
  "data": {}
}
```

**Error Responses:** `400`, `401`, `403`, `404` (parentId or studentId not found in caller's school), `409` (relationship already exists)

---

## 6. Announcements Service

**Owning Microservice:** `announcement-service`

### 6.1 Get Announcements

| Property | Value |
|---|---|
| Method | GET |
| Endpoint | `/announcements` |
| Allowed Roles | `SCHOOL_ADMIN`, `TEACHER`, `PARENT`, `STUDENT` |
| Tenant / Ownership Enforcement | Always filtered to caller's `schoolId`. `PARENT`/`STUDENT` additionally only see `SCHOOL_WIDE` announcements plus `CLASS_SPECIFIC` ones for classes they (or their linked student) belong to. |

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Announcements retrieved successfully.",
  "data": [
    {
      "id": "ANN001",
      "title": "Term Test Schedule",
      "content": "The term test will begin next Monday.",
      "type": "SCHOOL_WIDE",
      "classId": null,
      "createdAt": "2026-07-15T10:00:00Z"
    }
  ]
}
```

**Error Responses:** `401`, `403` (role not permitted)

### 6.2 Create Announcement

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/announcements` |
| Allowed Roles | `SCHOOL_ADMIN`, `TEACHER` |
| Tenant / Ownership Enforcement | Created under caller's `schoolId`. If `type` is `CLASS_SPECIFIC`, `classId` must belong to the caller's school, and for `TEACHER` callers, must be a class they're assigned to. |

**Request**

```json
{
  "title": "Grade 10 Parent Meeting",
  "content": "Discussion regarding project milestones.",
  "type": "CLASS_SPECIFIC",
  "classId": "CLS001"
}
```

**Success Response (201 Created)**

```json
{
  "success": true,
  "message": "Announcement created successfully.",
  "data": {
    "id": "ANN002"
  }
}
```

**Error Responses:** `400`, `401`, `403` (role not permitted, or `TEACHER` not assigned to `classId`), `404` (classId not found in caller's school)

---

## 7. Attendance Service

**Owning Microservice:** `attendance-service`

### 7.1 Submit Attendance

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/attendance` |
| Allowed Roles | `TEACHER` |
| Tenant / Ownership Enforcement | `classId` must belong to caller's `schoolId` **and** be a class the calling teacher is assigned to; every `studentId` in `records` must belong to that same `classId`. |

**Request**

```json
{
  "classId": "CLS001",
  "date": "2026-07-15",
  "records": [
    { "studentId": "STU001", "status": "PRESENT" },
    { "studentId": "STU002", "status": "ABSENT" }
  ]
}
```

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Attendance records saved successfully.",
  "data": {}
}
```

**Error Responses:** `400`, `401`, `403` (teacher not assigned to this class), `404` (classId or a studentId not found in caller's school), `409` (attendance for this class/date already submitted — use an update flow instead)

### 7.2 Submit Absence Justification

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/attendance/justification` |
| Allowed Roles | `PARENT` |
| Tenant / Ownership Enforcement | `studentId` must be linked to the calling parent (via §5.2 relationship) **and** belong to caller's `schoolId`. `attachmentFileId` must reference a file uploaded by this same caller (validated against `file-service` metadata). |

**Request**

```json
{
  "studentId": "STU002",
  "date": "2026-07-15",
  "reason": "Medical appointment",
  "attachmentFileId": "FIL00931"
}
```

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Justification submitted successfully.",
  "data": {}
}
```

**Error Responses:** `400`, `401`, `403` (student not linked to caller), `404` (studentId not found, or attachmentFileId not found / not owned by caller), `409` (justification already submitted for this date)

---

## 8. Consent Forms Service

**Owning Microservice:** `consent-form-service`

### 8.1 Create Consent Form

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/consent-forms` |
| Allowed Roles | `SCHOOL_ADMIN` |
| Tenant / Ownership Enforcement | Created under caller's `schoolId`. `attachmentFileId` must reference a file already uploaded by this caller via `file-service`. |

**Request**

```json
{
  "title": "Field Trip to Colombo Museum",
  "description": "Annual educational field excursion.",
  "deadline": "2026-07-20T23:59:59Z",
  "attachmentFileId": "FIL00842"
}
```

**Success Response (201 Created)**

```json
{
  "success": true,
  "message": "Consent form issued successfully.",
  "data": {
    "formId": "CNS001"
  }
}
```

**Error Responses:** `400`, `401`, `403`, `404` (attachmentFileId not found / not owned by caller)

### 8.2 Respond to Consent Form

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/consent-forms/{formId}/response` |
| Allowed Roles | `PARENT` |
| Tenant / Ownership Enforcement | `formId` must belong to caller's `schoolId`; `studentId` must be linked to the calling parent. |

**Request**

```json
{
  "studentId": "STU001",
  "status": "ACCEPTED"
}
```

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Response processed successfully.",
  "data": {}
}
```

**Error Responses:** `400`, `401`, `403` (student not linked to caller), `404` (formId not found in caller's school, or deadline has passed — treated as 404 to close the form), `409` (parent already responded for this student)

---

## 9. File Service

**Owning Microservice:** `file-service`

### 9.1 Request Upload URL

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/files/upload-url` |
| Allowed Roles | Any authenticated user |
| Tenant / Ownership Enforcement | File metadata record is stamped with caller's `schoolId` and `userId` at creation, so downstream ownership checks (§7.2, §8.1) can validate against it. |

**Request**

```json
{
  "fileName": "report.pdf",
  "fileType": "application/pdf"
}
```

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Pre-signed URL generated.",
  "data": {
    "fileId": "FIL00842",
    "uploadUrl": "https://vidyaconnect.s3.amazonaws.com/file",
    "downloadUrl": "https://dev-api.vidyaconnect.lk/api/v1/files/FIL00842"
  }
}
```

**Error Responses:** `400` (unsupported fileType or missing fileName), `401`

### 9.2 Get File Metadata / Download URL

| Property | Value |
|---|---|
| Method | GET |
| Endpoint | `/files/{fileId}` |
| Allowed Roles | Any authenticated user |
| Tenant / Ownership Enforcement | `fileId` must belong to caller's `schoolId`. |

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "File metadata retrieved.",
  "data": {
    "fileId": "FIL00842",
    "fileName": "report.pdf",
    "downloadUrl": "https://dev-api.vidyaconnect.lk/api/v1/files/FIL00842"
  }
}
```

**Error Responses:** `401`, `404` (fileId not found in caller's school)

---

## 10. Notifications Service

**Owning Microservice:** `notification-service`

### 10.1 Get Notification History

| Property | Value |
|---|---|
| Method | GET |
| Endpoint | `/notifications` |
| Allowed Roles | Any authenticated user |
| Tenant / Ownership Enforcement | Returns only notifications addressed to the caller (`userId` from JWT `sub`), implicitly scoped to their `schoolId`. |

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Notification log retrieved.",
  "data": [
    {
      "id": "NOTF001",
      "title": "Absence Alert",
      "body": "Your child was marked absent today.",
      "read": false,
      "createdAt": "2026-07-15T14:30:00Z"
    }
  ]
}
```

**Error Responses:** `401`

---

## 11. Health Checks

Every microservice exposes its own liveness/readiness endpoint so it can be probed independently in Docker Compose / EC2 / orchestration configs, rather than relying on one shared endpoint.

| Property | Value |
|---|---|
| Method | GET |
| Endpoint | `/health` (served by each service at its own base path, not proxied through `/api/v1`) |
| Allowed Roles | Public |
| Tenant / Ownership Enforcement | Not applicable — no tenant data involved. |

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Service operational.",
  "data": {
    "service": "attendance-service",
    "status": "UP",
    "timestamp": "2026-07-15T16:31:00Z",
    "dependencies": {
      "database": "CONNECTED"
    }
  }
}
```

### 11.1 Aggregate Platform Health

| Property | Value |
|---|---|
| Method | GET |
| Endpoint | `/api/v1/health` |
| Owning Component | API Gateway |
| Allowed Roles | Public |

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "System operational.",
  "data": {
    "status": "UP",
    "timestamp": "2026-07-15T16:31:00Z",
    "services": {
      "school-user-service": "UP",
      "announcement-service": "UP",
      "attendance-service": "UP",
      "consent-form-service": "UP",
      "file-service": "UP",
      "notification-service": "UP"
    }
  }
}
```

**Error Responses:** `503 Service Unavailable` if one or more downstream services fail their individual `/health` check (not shown in the 400/401/403/404/409 table above since this is the one endpoint where a 5xx is the meaningful failure mode).
