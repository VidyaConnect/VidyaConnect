import jwt from 'jsonwebtoken';

/** Gets the Keycloak user id from the Bearer token (already verified by the auth middleware). */
export function getKeycloakId(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const decoded = token ? jwt.decode(token) : null;
  return decoded?.sub ?? null;
}