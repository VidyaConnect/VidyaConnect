const jwt = require('jsonwebtoken');
const { getSigningKey } = require('../config/keycloak');
const { error } = require('../utils/response');
const logger = require('../utils/logger');

const keycloakAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return error(res, 'No authorization header provided', 401);
  }
  if (!authHeader.startsWith('Bearer ')) {
    return error(res, 'Invalid authorization format. Use Bearer token', 401);
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return error(res, 'No token provided', 401);
  }

  // Decode header first to get the key id (kid) without verifying yet
  const decodedHeader = jwt.decode(token, { complete: true });
  if (!decodedHeader) {
    return error(res, 'Invalid token', 401);
  }

  const kid = decodedHeader.header.kid;

  getSigningKey(kid, (err, signingKey) => {
    if (err) {
      logger.error('Failed to get Keycloak signing key', err);
      return error(res, 'Unable to verify token', 401);
    }

    jwt.verify(token, signingKey, { algorithms: ['RS256'] }, (verifyErr, decoded) => {
      if (verifyErr) {
        if (verifyErr.name === 'TokenExpiredError') {
          return error(res, 'Token has expired. Please login again', 401);
        }
        return error(res, 'Invalid token', 401);
      }

      // #123, #124, #125 — extract user id, role, school_id
      req.user = {
        userId: decoded.sub,
        email: decoded.email,
        fullName: decoded.name || decoded.preferred_username,
        role: extractRole(decoded),
        schoolId: decoded.school_id || decoded.schoolId || null
      };

      next();
    });
  });
};

// #124 — role can live in different places depending on Keycloak config
function extractRole(decoded) {
  // Custom claim (if damsi adds a "role" mapper directly on the token)
  if (decoded.role) return decoded.role;

  // Realm role (Keycloak default location)
  if (decoded.realm_access && decoded.realm_access.roles) {
    const appRoles = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'PARENT', 'STUDENT'];
    const match = decoded.realm_access.roles.find(r => appRoles.includes(r));
    if (match) return match;
  }

  return null;
}

module.exports = keycloakAuth;