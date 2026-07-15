# VidyaConnect API Contracts v1

This document defines the official API contracts for the VidyaConnect platform microservices ecosystem.

It specifies:

- API endpoints
- HTTP methods
- Request and response models
- Role-based permissions
- Multi-tenancy isolation rules
- Service ownership boundaries
- Standard API response formats

---

## 1. Global Specifications & Architecture Rules

### 1.1 Base API Path

All API routes must use the following prefix:

```
/api/v1
```

### 1.2 Standard Response Format

Every API response follows the standard structure:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

### 1.3 Error Response Format

All errors must return appropriate HTTP status codes with the following structure:

```json
{
  "success": false,
  "message": "Error description goes here.",
  "data": {}
}
```

### 1.4 Multi-Tenancy Security Rules

VidyaConnect follows a multi-tenant architecture.

Rules:
- Each school operates as an isolated tenant.
- Every authenticated request contains a JWT context.
- The JWT contains the `school_id` property.
- All state-changing operations must validate tenant ownership.
- Users cannot access data belonging to another school.

---

## 2. Authentication & User Management Service

**Service Overview**

Manages user authentication, JWT token generation, credential validation, password recovery, and security context management.

**Owning Microservice:** Authentication & Security Engine

### 2.1 User Login

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/auth/login` |
| Allowed Roles | Public |
| Tenant Rule | Validates user identity and maps correct school_id |

**Request**

```json
{
  "email": "user@vidyaconnect.lk",
  "password": "SecurePassword123!"
}
```

**Success Response (200 OK)**

```json
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
```

### 2.2 Password Reset Request

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/auth/password-reset/request` |
| Allowed Roles | Public |
| Tenant Rule | Checks registered tenant identifiers |

**Request**

```json
{
  "email": "user@vidyaconnect.lk"
}
```

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Password reset email dispatched successfully.",
  "data": {}
}
```

---

## 3. Core Administrative & School Operations Service

**Service Overview**

Provides school management, class management, subject management, academic assignments, and user administration.

**Owning Microservice:** School Operations Core

### 3.1 Create New School

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/schools` |
| Allowed Roles | Super Admin |
| Tenant Rule | Creates new school isolation boundary |

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

### 3.3 Assign Teacher to Subject

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/subjects/assign` |
| Allowed Roles | School Admin, Principal |

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

---

## 4. Student & Parent Relationship Service

**Service Overview**

Responsible for student profile creation, parent-student linking, and relationship validation.

**Owning Microservice:** Relationship Registry Engine

### 4.1 Create Student Profile

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/students` |
| Allowed Roles | School Admin |

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

### 4.2 Link Parent to Student

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/relationships/parent-student` |
| Allowed Roles | School Admin |

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
  "message": "Parent-student boundary map applied successfully.",
  "data": {}
}
```

---

## 5. Announcements Service

**Service Overview**

Handles school announcements, class announcements, and institutional communication.

**Owning Microservice:** Announcement Service

### 5.1 Get Announcements

| Property | Value |
|---|---|
| Method | GET |
| Endpoint | `/announcements` |
| Allowed Roles | School Admin, Principal, Teacher, Parent, Student |

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

### 5.2 Create Announcement

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/announcements` |
| Allowed Roles | School Admin, Teacher |

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

---

## 6. Attendance Service

**Service Overview**

Manages daily attendance recording and absence justification.

**Owning Microservice:** Attendance Service

### 6.1 Submit Attendance

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/attendance` |
| Allowed Roles | Teacher |

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

### 6.2 Submit Absence Justification

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/attendance/justification` |
| Allowed Roles | Parent/Guardian |

**Request**

```json
{
  "studentId": "STU002",
  "date": "2026-07-15",
  "reason": "Medical appointment",
  "attachmentUrl": "https://s3.vidyaconnect.lk/absences/med-01.pdf"
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

---

## 7. Consent Forms Service

**Service Overview**

Handles digital consent management.

**Owning Microservice:** Consent Form Service

### 7.1 Create Consent Form

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/consent-forms` |
| Allowed Roles | School Admin |

**Request**

```json
{
  "title": "Field Trip to Colombo Museum",
  "description": "Annual educational field excursion.",
  "deadline": "2026-07-20T23:59:59Z",
  "attachmentUrl": "https://s3.vidyaconnect.lk/forms/trip-details.pdf"
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

### 7.2 Respond to Consent Form

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/consent-forms/{formId}/response` |
| Allowed Roles | Parent/Guardian |

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

---

## 8. File Service

**Service Overview**

Provides secure AWS S3 file operations.

**Owning Microservice:** File Access Layer

### 8.1 Request Upload URL

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/files/upload-url` |
| Allowed Roles | Authenticated User |

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
    "uploadUrl": "https://vidyaconnect.s3.amazonaws.com/file",
    "downloadUrl": "https://dev-api.vidyaconnect.lk/api/v1/files/report.pdf"
  }
}
```

---

## 9. Notifications Service

**Service Overview**

Handles system notifications.

**Owning Microservice:** Notification Service

### 9.1 Get Notification History

| Property | Value |
|---|---|
| Method | GET |
| Endpoint | `/notifications` |
| Allowed Roles | Authenticated User |

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

---

## 10. Health Check System

**Service Overview**

Monitors platform availability and core environment dependencies.

**Owning Microservice:** Infrastructure Management Layer

### 10.1 System Status

| Property | Value |
|---|---|
| Method | GET |
| Endpoint | `/health` |
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
      "database": "CONNECTED",
      "storage": "CONNECTED"
    }
  }
}
```
