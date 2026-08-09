# Authentication Middleware Reuse

## Overview

The authentication middleware (`keycloakAuth`) and Role-Based Access Control middleware (`rbac`) are implemented as reusable components located in:

```
backend/src/middleware/
```

These middleware components are designed to be shared across all protected modules within the VidyaConnect backend, including:

- School Management
- User Management
- Announcements
- Assignments
- Attendance
- Calendar
- Notifications
- Consent Forms
- Future protected APIs

---

## Usage

For any protected route, import the middleware and apply it before the controller.

```javascript
const keycloakAuth = require('../middleware/keycloakAuth');
const rbac = require('../middleware/rbac');

// Example
router.post(
  '/<resource>',
  keycloakAuth,
  rbac(['SCHOOL_ADMIN']),
  controller.create
);
```

---

## Design Principle

Authentication and authorization logic should be centralized within the shared middleware.

Individual modules **must not** implement their own JWT validation or role-checking logic. Instead, all protected routes should reuse the common `keycloakAuth` and `rbac` middleware to ensure:

- Consistent authentication across the application
- Centralized authorization rules
- Easier maintenance
- Reduced code duplication
- Consistent security behavior