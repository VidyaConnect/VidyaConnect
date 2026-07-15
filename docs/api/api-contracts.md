# VidyaConnect API Contracts v1

## Document Overview

This document defines the official API contracts for the **VidyaConnect platform microservices ecosystem**.

It specifies:

- API endpoints
- HTTP methods
- Request and response models
- Role-based permissions
- Multi-tenancy isolation rules
- Service ownership boundaries
- Standard API response formats

---

# 1. Global Specifications & Architecture Rules

## 1.1 Base API Path

All API routes must use the following prefix:


/api/v1


---

## 1.2 Standard Response Format

Every API response follows the standard structure:

```json```
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
1.3 Error Response Format

All errors must return appropriate HTTP status codes with the following structure:

{
  "success": false,
  "message": "Error description goes here.",
  "data": {}
}
1.4 Multi-Tenancy Security Rules

VidyaConnect follows a multi-tenant architecture.

Rules:

Each school operates as an isolated tenant.
Every authenticated request contains a JWT context.
The JWT contains the school_id property.
All state-changing operations must validate tenant ownership.
Users cannot access data belonging to another school.
2. Authentication & User Management Service
Service Overview

Manages:

User authentication
JWT token generation
Credential validation
Password recovery
Security context management

Owning Microservice:

Authentication & Security Engine
2.1 User Login
Endpoint Information
Property	Value
Method	POST
Endpoint	/auth/login
Allowed Roles	Public
Tenant Rule	Validates user identity and maps correct school_id
Request
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
2.2 Password Reset Request
Endpoint Information
Property	Value
Method	POST
Endpoint	/auth/password-reset/request
Allowed Roles	Public
Tenant Rule	Checks registered tenant identifiers
Request
{
  "email": "user@vidyaconnect.lk"
}
Success Response (200 OK)
{
  "success": true,
  "message": "Password reset email dispatched successfully.",
  "data": {}
}
3. Core Administrative & School Operations Service
Service Overview

Provides:

School management
Class management
Subject management
Academic assignments
User administration

Owning Microservice:

School Operations Core
3.1 Create New School
Endpoint Information
Property	Value
Method	POST
Endpoint	/schools
Allowed Roles	Super Admin
Tenant Rule	Creates new school isolation boundary
Request
{
  "name": "Ananda College",
  "address": "Colombo 10, Sri Lanka",
  "contactNumber": "+94112345678",
  "domain": "anandacollege.lk"
}
Success Response (201 Created)
{
  "success": true,
  "message": "School entity provisioned successfully.",
  "data": {
    "schoolId": "SCH001"
  }
}
3.2 Get Classes List
Endpoint Information
Property	Value
Method	GET
Endpoint	/classes
Allowed Roles	School Admin, Principal, Teacher, Parent, Student
Tenant Rule	Filters using user's school_id
Success Response
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
3.3 Assign Teacher to Subject
Endpoint Information
Property	Value
Method	POST
Endpoint	/subjects/assign
Allowed Roles	School Admin, Principal
Request
{
  "teacherId": "TCH005",
  "subjectId": "SUB991",
  "classId": "CLS001"
}
Success Response
{
  "success": true,
  "message": "Academic assignment verified and logged.",
  "data": {}
}
4. Student & Parent Relationship Service
Service Overview

Responsible for:

Student profile creation
Parent-student linking
Relationship validation

Owning Microservice:

Relationship Registry Engine
4.1 Create Student Profile
Endpoint Information
Property	Value
Method	POST
Endpoint	/students
Allowed Roles	School Admin
Request
{
  "firstName": "Arjun",
  "lastName": "Perera",
  "dateOfBirth": "2011-05-14",
  "classId": "CLS001"
}
Response
{
  "success": true,
  "message": "Student profile instantiated successfully.",
  "data": {
    "studentId": "STU001"
  }
}
4.2 Link Parent to Student
Endpoint Information
Property	Value
Method	POST
Endpoint	/relationships/parent-student
Allowed Roles	School Admin
Request
{
  "parentId": "PRN441",
  "studentId": "STU001",
  "relationshipType": "FATHER"
}
Response
{
  "success": true,
  "message": "Parent-student boundary map applied successfully.",
  "data": {}
}
5. Announcements Service
Service Overview

Handles:

School announcements
Class announcements
Institutional communication

Owning Microservice:

Announcement Service
5.1 Get Announcements
Endpoint Information
Property	Value
Method	GET
Endpoint	/announcements
Allowed Roles	School Admin, Principal, Teacher, Parent, Student
Response
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
5.2 Create Announcement
Endpoint Information
Property	Value
Method	POST
Endpoint	/announcements
Allowed Roles	School Admin, Teacher
Request
{
  "title": "Grade 10 Parent Meeting",
  "content": "Discussion regarding project milestones.",
  "type": "CLASS_SPECIFIC",
  "classId": "CLS001"
}
Response
{
  "success": true,
  "message": "Announcement created successfully.",
  "data": {
    "id": "ANN002"
  }
}
6. Attendance Service
Service Overview

Manages:

Daily attendance recording
Absence justification

Owning Microservice:

Attendance Service
6.1 Submit Attendance
Endpoint Information
Property	Value
Method	POST
Endpoint	/attendance
Allowed Roles	Teacher
Request
{
  "classId": "CLS001",
  "date": "2026-07-15",
  "records": [
    {
      "studentId": "STU001",
      "status": "PRESENT"
    },
    {
      "studentId": "STU002",
      "status": "ABSENT"
    }
  ]
}
Response
{
  "success": true,
  "message": "Attendance records saved successfully.",
  "data": {}
}
6.2 Submit Absence Justification
Endpoint Information
Property	Value
Method	POST
Endpoint	/attendance/justification
Allowed Roles	Parent/Guardian
Request
{
  "studentId": "STU002",
  "date": "2026-07-15",
  "reason": "Medical appointment",
  "attachmentUrl": "https://s3.vidyaconnect.lk/absences/med-01.pdf"
}
Response
{
  "success": true,
  "message": "Justification submitted successfully.",
  "data": {}
}
7. Consent Forms Service
Service Overview

Handles digital consent management.

Owning Microservice:

Consent Form Service
7.1 Create Consent Form
Endpoint
POST /consent-forms
Allowed Roles
School Admin
Request
{
  "title": "Field Trip to Colombo Museum",
  "description": "Annual educational field excursion.",
  "deadline": "2026-07-20T23:59:59Z",
  "attachmentUrl": "https://s3.vidyaconnect.lk/forms/trip-details.pdf"
}
Response
{
  "success": true,
  "message": "Consent form issued successfully.",
  "data": {
    "formId": "CNS001"
  }
}
7.2 Respond to Consent Form
POST /consent-forms/{formId}/response
Request
{
  "studentId": "STU001",
  "status": "ACCEPTED"
}
8. File Service
Service Overview

Provides secure AWS S3 file operations.

Owning Microservice:

File Access Layer
8.1 Request Upload URL
POST /files/upload-url
Request
{
  "fileName": "report.pdf",
  "fileType": "application/pdf"
}
Response
{
  "success": true,
  "message": "Pre-signed URL generated.",
  "data": {
    "uploadUrl": "https://vidyaconnect.s3.amazonaws.com/file",
    "downloadUrl": "https://dev-api.vidyaconnect.lk/api/v1/files/report.pdf"
  }
}
9. Notifications Service
Service Overview

Handles system notifications.

Owning Microservice:

Notification Service
9.1 Get Notification History
GET /notifications
Response
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
Service Overview

Monitors platform availability and dependencies.

Owning Microservice:

Infrastructure Management Layer
10.1 System Status
Endpoint
GET /health
Allowed Roles
Public
Response
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



