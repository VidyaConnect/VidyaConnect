# Authentication Testing Guide

**Project:** VidyaConnect  
**Component:** Backend Authentication (Keycloak + JWT + RBAC)  
**Status:** Draft  
**Related Issues:** #123, #124, #125, #127, #129

---

# Purpose

This document describes the manual testing procedure for validating the authentication and authorization middleware implemented in the VidyaConnect backend.

The tests verify:

- JWT authentication
- Invalid token handling
- Token expiration handling
- Role-Based Access Control (RBAC)
- User information extraction from JWT claims

> **Note**
>
> At the time of writing, Keycloak integration is still being completed. Therefore, some tests can be performed immediately, while others require a running Keycloak instance.

---

# Prerequisites

- Node.js backend is running.
- Authentication middleware (`keycloakAuth`) is configured.
- RBAC middleware (`rbac`) is configured.
- A protected API endpoint exists (or will exist) that uses the authentication middleware.

---

# Phase 1 – Testing Before Keycloak Is Available

These tests verify that the authentication middleware correctly rejects invalid requests.

## Test 1 – Missing Authorization Header

### Steps

Call a protected endpoint without sending an `Authorization` header.

### Expected Result

- HTTP Status: **401 Unauthorized**
- Response message:

```
No authorization header provided
```

---

## Test 2 – Invalid Authorization Format

### Steps

Call a protected endpoint using an invalid Authorization header.

Example:

```
Authorization: NotBearer abc123
```

### Expected Result

- HTTP Status: **401 Unauthorized**
- Response message:

```
Invalid authorization format. Use Bearer token
```

---

## Test 3 – Invalid JWT Token

### Steps

Call a protected endpoint using a malformed or invalid JWT.

Example:

```
Authorization: Bearer garbage.token.here
```

### Expected Result

- HTTP Status: **401 Unauthorized**
- Response message:

```
Invalid token
```

---

# Phase 2 – Testing After Keycloak Setup

These tests require:

- Keycloak server running
- VidyaConnect realm configured
- Valid user accounts
- JWT access tokens issued by Keycloak

---

## Test 4 – Valid Authentication

### Steps

1. Log in through Keycloak.
2. Obtain a valid JWT access token.
3. Call a protected API endpoint.

### Expected Result

- HTTP Status: **200 OK**
- Authentication succeeds.
- The backend extracts and populates:

- `userId`
- `email`
- `fullName`
- `role`
- `schoolId`

---

## Test 5 – Expired Token

### Steps

1. Use an expired access token.
2. Call a protected endpoint.

### Expected Result

- HTTP Status: **401 Unauthorized**
- Response message:

```
Token has expired. Please login again
```

---

## Test 6 – Unauthorized Role (RBAC)

### Steps

1. Log in as a user without the required role.
2. Access an endpoint protected by RBAC.

### Expected Result

- HTTP Status: **403 Forbidden**
- Response message similar to:

```
Access denied. Required roles: <required-role>
```

---

## Test 7 – Authorized Role (RBAC)

### Steps

1. Log in as a user with the required role.
2. Access the same protected endpoint.

### Expected Result

- HTTP Status: **200 OK**
- The request proceeds successfully.

---

# Expected Authentication Responses

| Scenario | Expected Status | Expected Response |
|-----------|-----------------|-------------------|
| Missing Authorization header | 401 | No authorization header provided |
| Invalid Authorization format | 401 | Invalid authorization format. Use Bearer token |
| Invalid JWT | 401 | Invalid token |
| Expired JWT | 401 | Token has expired. Please login again |
| Insufficient role | 403 | Access denied |
| Valid JWT and authorized role | 200 | Request succeeds |

---

# Notes

- This document validates the authentication and RBAC middleware implementation.
- Protected endpoint URLs are intentionally omitted because API endpoint definitions are still under development.
- Once the API contracts for protected endpoints are finalized, this document should be updated with the corresponding endpoint URLs and request examples.

---

**Prepared By:** Dulmi Sehajinie  
**Related GitHub Issue:** #129  
**Last Updated:** July 2026