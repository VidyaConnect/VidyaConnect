# VidyaConnect API Contracts v1

This document specifies the official API endpoints, methods, expected request/response models, role permissions, and tenant isolation logic for the VidyaConnect microservices ecosystem.

---

## 1. Global Specifications & Architecture Rules

*   **Base URL Path:** All API routes are prefixed by `/api/v1`.
*   **Response Wrapping:** Every API response must adhere to a standardized schema containing `success`, `message`, and `data` fields.
*   **Error Standard:** Errors must return an appropriate HTTP status code (4xx/5xx) accompanied by a descriptive error payload mirroring the schema structure:
    ```json
    {
      "success": false,
      "message": "Error description goes here.",
      "data": {}
    }
    ```
*   **Multi-Tenancy Guardrails:** Except for cross-tenant public infrastructure flags, every stateful transaction must implicitly extract and enforce authorization filtering utilizing the JWT context `school_id` property.

---

## 2. Authentication & User Management Service

### Overview
Manages platform security contexts, token issuance, multi-factor setups, and user credential validation layers.

**Owning Microservice:** Authentication & Security Engine

---

### User Login
*   **Method:** POST
*   **Endpoint:** `/auth/login`
*   **Allowed Roles:** Public
*   **Tenant Rule:** Validates user identifiers across institutional sub-domains to map the correct `school_id`.

#### Request
```json
{
  "email": "user@vidyaconnect.lk",
  "password": "SecurePassword123!"
}
Success Response (200 OK)
{
  "success": true,
  "message": "Authentication successful.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400,
    "user": {
      "id": "USR10029",
      "name": "Jane Doe",
      "email": "user@vidyaconnect.lk",
      "role": "TEACHER",
      "schoolId": "SCH001"
    }
  }
}

Reset Password Request
Method: POST

Endpoint: /auth/password-reset/request

Allowed Roles: Public

Tenant Rule: Cross-references the targeted email against registered tenant identifiers.

Request
JSON
{
  "email": "user@vidyaconnect.lk"
}
Success Response (200 OK)
JSON
{
  "success": true,
  "message": "Password reset email dispatched successfully.",
  "data": {}
}

3. Core Administrative & School Operations Service
Overview
Provides foundational management tools for schools, academic classes, subject frameworks, and user records.

Owning Microservice: School Operations Core

Create New School
Method: POST

Endpoint: /schools

Allowed Roles: Super Admin

Tenant Rule: Creates a new distinct isolation boundary (school_id).


Request
JSON
{
  "name": "Ananda College",
  "address": "Colombo 10, Sri Lanka",
  "contactNumber": "+94112345678",
  "domain": "anandacollege.lk"
}
Success Response (201 Created)
JSON
{
  "success": true,
  "message": "School entity provisioned successfully.",
  "data": {
    "schoolId": "SCH001"
  }
}
Get Classes List
Method: GET

Endpoint: /classes

Allowed Roles: School Admin, Principal, Teacher, Parent, Student

Tenant Rule: Scopes responses explicitly to the user's active token school_id.

Success Response (200 OK)
JSON
{
  "success": true,
  "message": "Classes data payload compiled.",
  "data": [
    {
      "id": "CLS001",
      "className": "Grade 10-A",
      "gradeLevel": 10,
      "classTeacherId": "TCH005"
    }
  ]
}
Assign Teacher to Subject
Method: POST

Endpoint: /subjects/assign

Allowed Roles: School Admin, Principal

Tenant Rule: Validates that both the subject and the teacher exist inside the actor's school_id.

Request
JSON
{
  "teacherId": "TCH005",
  "subjectId": "SUB991",
  "classId": "CLS001"
}
Success Response (200 OK)
JSON
{
  "success": true,
  "message": "Academic assignment verified and logged.",
  "data": {}
}
4. Student & Parent Relationship Service
Overview
Maintains student profiles, links parents or guardians to their respective children, and routes records accordingly.

Owning Microservice: Relationship Registry Engine

Create Student Profile
Method: POST

Endpoint: /students

Allowed Roles: School Admin

Tenant Rule: Appends the new student entity directly to the administrator's structural school_id.

Request
JSON
{
  "firstName": "Arjun",
  "lastName": "Perera",
  "dateOfBirth": "2011-05-14",
  "classId": "CLS001"
}
Success Response (201 Created)
JSON
{
  "success": true,
  "message": "Student profile instantiated successfully.",
  "data": {
    "studentId": "STU001"
  }
}
Link Parent to Student
Method: POST

Endpoint: /relationships/parent-student

Allowed Roles: School Admin

Tenant Rule: Strictly requires both entities to belong to the exact same school_id.

Request
JSON
{
  "parentId": "PRN441",
  "studentId": "STU001",
  "relationshipType": "FATHER"
}
Success Response (200 OK)
JSON
{
  "success": true,
  "message": "Parent-student boundary map applied successfully.",
  "data": {}
}
5. Announcements Service
Overview
Handles the distribution of institutional and class-level notices.

Owning Microservice: Announcement Service

Get Announcements
Method: GET

Endpoint: /announcements

Allowed Roles: School Admin, Principal, Teacher, Parent, Student

Tenant Rule: Filters announcements strictly within the user's school_id.

Success Response (200 OK)
JSON
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
Create Announcement
Method: POST

Endpoint: /announcements

Allowed Roles: School Admin, Teacher

Tenant Rule: Formally tied to the sender's authenticated school_id.

Request
JSON
{
  "title": "Grade 10 Parent Meeting",
  "content": "Discussion regarding project milestones.",
  "type": "CLASS_SPECIFIC",
  "classId": "CLS001"
}
Success Response (201 Created)
JSON
{
  "success": true,
  "message": "Announcement created successfully.",
  "data": {
    "id": "ANN002"
  }
}
6. Attendance Service
Overview
Manages the verification and retention of daily student presence.

Owning Microservice: Attendance Service

Submit Attendance
Method: POST

Endpoint: /attendance

Allowed Roles: Teacher

Tenant Rule: Records must bind exclusively to the teacher's active tenant school_id.

Request
JSON
{
  "classId": "CLS001",
  "date": "2026-07-15",
  "records": [
    { "studentId": "STU001", "status": "PRESENT" },
    { "studentId": "STU002", "status": "ABSENT" }
  ]
}
Success Response (200 OK)
JSON
{
  "success": true,
  "message": "Attendance records saved successfully.",
  "data": {}
}
Submit Absence Justification
Method: POST

Endpoint: /attendance/justification

Allowed Roles: Parent/Guardian

Tenant Rule: Verified against the parent's authenticated tenant boundary.

Request
JSON
{
  "studentId": "STU002",
  "date": "2026-07-15",
  "reason": "Medical appointment",
  "attachmentUrl": "[https://s3.vidyaconnect.lk/absences/med-01.pdf](https://s3.vidyaconnect.lk/absences/med-01.pdf)"
}
Success Response (200 OK)
JSON
{
  "success": true,
  "message": "Justification submitted successfully.",
  "data": {}
}
7. Consent Forms Service
Overview
Manages digital validation distribution and verification for parents.

Owning Microservice: Consent Form Service

Create Consent Form
Method: POST

Endpoint: /consent-forms

Allowed Roles: School Admin

Tenant Rule: Bound directly to the issuing admin's school_id.

Request
JSON
{
  "title": "Field Trip to Colombo Museum",
  "description": "Annual educational field excursion.",
  "deadline": "2026-07-20T23:59:59Z",
  "attachmentUrl": "[https://s3.vidyaconnect.lk/forms/trip-details.pdf](https://s3.vidyaconnect.lk/forms/trip-details.pdf)"
}
Success Response (201 Created)
JSON
{
  "success": true,
  "message": "Consent form issued successfully.",
  "data": {
    "formId": "CNS001"
  }
}
Respond to Consent Form
Method: POST

Endpoint: /consent-forms/{formId}/response

Allowed Roles: Parent/Guardian

Tenant Rule: Verified via parent's token schema context.

Request
JSON
{
  "studentId": "STU001",
  "status": "ACCEPTED"
}
Success Response (200 OK)
JSON
{
  "success": true,
  "message": "Response submitted successfully.",
  "data": {}
}
8. File Service
Overview
Interacts with AWS S3 using authenticated token structures to prevent public leakage.

Owning Microservice: File Access Layer / Service

Request Pre-Signed Upload URL
Method: POST

Endpoint: /files/upload-url

Allowed Roles: School Admin, Teacher, Parent

Tenant Rule: Extracted metadata must comply with the tenant context mapping.

Request
JSON
{
  "fileName": "report.pdf",
  "fileType": "application/pdf"
}
Success Response (200 OK)
JSON
{
  "success": true,
  "message": "Pre-signed URL generated.",
  "data": {
    "uploadUrl": "[https://vidyaconnect.s3.amazonaws.com/SCH001/report.pdf?AWSAccessKeyId=](https://vidyaconnect.s3.amazonaws.com/SCH001/report.pdf?AWSAccessKeyId=)...",
    "downloadUrl": "[https://dev-api.vidyaconnect.lk/api/v1/files/SCH001/report.pdf](https://dev-api.vidyaconnect.lk/api/v1/files/SCH001/report.pdf)"
  }
}
9. Notifications Service
Overview
Dispatches operational payloads downstream via AWS SNS nodes.

Owning Microservice: Notification Service

Get Notification History
Method: GET

Endpoint: /notifications

Allowed Roles: Super Admin, School Admin, Teacher, Parent, Student

Tenant Rule: Constrained strictly to the user's specific context footprint.

Success Response (200 OK)
JSON
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
10. Health Check System
Overview
Exposes status flags checking active downstream dependencies for platform monitoring.

Owning Microservice: Infrastructure Management Layer

System Status
Method: GET

Endpoint: /health

Allowed Roles: Public

Tenant Rule: Not Applicable

Success Response (200 OK)
JSON
{
  "success": true,
  "message": "System operational.",
  "data": {
    "status": "UP",
    "timestamp": "2026-07-15T16:31:00Z",
    "services": {
      "database": "CONNECTED",
      "storage": "CONNECTED"
    }
  }
}


