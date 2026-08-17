import { error } from "../utils/response.js";

const rbac = (allowedRoles = []) => {
  return (req, res, next) => {
    if (process.env.AUTH_DISABLED === "true") {
      return next();
    }

    if (!req.user) {
      return error(res, "Authentication required", 401);
    }

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