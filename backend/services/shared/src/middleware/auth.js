import jwt from "jsonwebtoken";
import { getSigningKey } from "../config/keycloak.js";
import { error } from "../utils/response.js";
import logger from "../utils/logger.js";

const auth = (req, res, next) => {
  if (process.env.AUTH_DISABLED === "true") {
    req.user = {
      userId: process.env.DEV_USER_ID || "dev-user-id",
      email: "dev@vidyaconnect.local",
      fullName: "Dev User",
      role: process.env.DEV_USER_ROLE || "TEACHER",
      schoolId: process.env.DEV_SCHOOL_ID || "dev-school-id",
      classId: process.env.DEV_CLASS_ID || "class-8a",
      studentId: process.env.DEV_STUDENT_ID || "student-001",
      parentId: process.env.DEV_PARENT_ID || "dev-parent-id",
    };
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return error(res, "No authorization header provided", 401);
  }

  // Check Bearer token format
  if (!authHeader.startsWith("Bearer ")) {
    return error(res, "Invalid authorization format. Use Bearer token", 401);
  }

  // Extract token
  const token = authHeader.split(" ")[1];

  if (!token) {
    return error(res, "No token provided", 401);
  }

  // Decode JWT header to obtain Keycloak key ID (kid)
  const decodedHeader = jwt.decode(token, { complete: true });

  if (!decodedHeader || !decodedHeader.header) {
    return error(res, "Invalid token", 401);
  }

  // Retrieve public signing key from Keycloak JWKS
  getSigningKey(decodedHeader.header, (err, signingKey) => {
    if (err) {
      logger.error("Failed to retrieve Keycloak signing key", err);
      return error(res, "Unable to verify token", 401);
    }

    // Verify JWT
    jwt.verify(
      token,
      signingKey,
      {
        algorithms: ["RS256"],
      },
      (verifyErr, decoded) => {
        if (verifyErr) {
          if (verifyErr.name === "TokenExpiredError") {
            return error(
              res,
              "Token has expired. Please login again",
              401
            );
          }

          return error(res, "Invalid token", 401);
        }

        // Attach authenticated user context
        req.user = {
          userId: decoded.sub,
          email: decoded.email,
          fullName: decoded.name || decoded.preferred_username,
          role: extractRole(decoded),
          schoolId: decoded.school_id || decoded.schoolId || null,
        };

        next();
      }
    );
  });
};

/**
 * Extract application role from Keycloak token
 */
function extractRole(decoded) {
  // Custom mapped role
  if (decoded.role) {
    return decoded.role;
  }

  // Default Keycloak realm roles
  if (decoded.realm_access?.roles) {
    const appRoles = [
      "SUPER_ADMIN",
      "SCHOOL_ADMIN",
      "TEACHER",
      "PARENT",
      "STUDENT",
    ];

    const role = decoded.realm_access.roles.find((r) =>
      appRoles.includes(r)
    );

    if (role) {
      return role;
    }
  }

  return null;
}

export default auth;