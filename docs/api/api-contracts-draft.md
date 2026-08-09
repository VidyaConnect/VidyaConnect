# VidyaConnect API Contracts v1 draft

**Version:** v1 Draft

**Status:** Draft

## Table of Contents

1. Overview
2. Technology
3. Base URL
4. Authentication
5. Standard Responses
6. Pagination
7. Multi-Tenant Rules
8. Authentication API
9. Future Endpoints


---

## Overview

This document defines the Version 1 REST API contracts for the VidyaConnect platform.

The API contracts specify the request format, response format, authentication requirements, endpoint structure, and common conventions used by the backend services.

These contracts serve as an agreement between frontend and backend developers before implementation begins.

---

## Technology stack 

- REST API
- HTTPS
- JSON
- Express.js
- PostgreSQL
- JWT Authentication
- AWS S3


# Base URL

Development

```
https://dev-api.vidyaconnect.lk/api/v1
```

Staging

```
https://staging-api.vidyaconnect.lk/api/v1
```

Production

```
https://api.vidyaconnect.lk/api/v1
```
# Authentication

All protected endpoints require a valid JWT access token.
JWT access tokens shall be included in the Authorization header using the Bearer authentication scheme.

Authorization Header

```http
Authorization: Bearer <JWT_TOKEN>
```

JWT Payload

| Field | Description |
|--------|-------------|
| userId | User Identifier |
| schoolId | School Identifier |
| role | User Role |
| tokenVersion | Token Version |


# Standard Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

# Standard Error Response
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "email",
      "message": "Email is required."
    }
 ]
}


# Pagination

Collection endpoints support pagination.

Example

```
GET /students?page=1&limit=20
```

Parameters

| Parameter | Description |
|-----------|-------------|
| page | Page Number |
| limit | Records per Page |


# Multi-Tenant Rules

Every protected request shall be scoped to the authenticated user's school.

The backend shall validate the `schoolId` contained in the JWT before processing requests.

Cross-school access attempts shall return:

```
HTTP 403 Forbidden
```

All violations shall be recorded in the audit log.


# Authentication API

## Login

**POST**

```
/auth/login
```

### Request

```json
{
  "email": "teacher@school.lk",
  "password": "Password123"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": {
      "id": "USR001",
      "role": "Teacher",
      "schoolId": "SCH001"
    }
  }
}
```



---

# Future Endpoints

This document represents the initial Version 1 API Contracts Draft.

Additional endpoint specifications will be added during future iterations, including:

- User Management APIs
- School Management APIs
- Attendance APIs
- Assignment APIs
- Announcement APIs
- Notification APIs
- Consent Form APIs
- AI Assistant APIs
- File Upload APIs





                                                 ---

