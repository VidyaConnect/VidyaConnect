import { error } from "../utils/response.js";

const rbac = (allowedRoles = []) => {
  return (req, res, next) => {

    // User must be authenticated first
    if (!req.user) {
      return error(res, "Authentication required", 401);
    }

    // Check user role permission
    if (!allowedRoles.includes(req.user.role)) {
      return error(
        res,
        `Access denied. Required roles: ${allowedRoles.join(", ")}`,
        403
      );
    }

    next();
  };
};

export default rbac;