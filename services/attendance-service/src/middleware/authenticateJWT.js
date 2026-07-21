// TODO: Replace with shared auth middleware from feature/auth (#113) once merged.
// Currently duplicated locally in attendance-service for standalone development.
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: process.env.KEYCLOAK_JWKS_URI || 'http://localhost:8080/realms/vidyaconnect/protocol/openid-connect/certs',
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, getKey, {}, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = decoded; // contains sub, school_id (custom claim), roles etc.
    next();
  });
}

module.exports = authenticateJWT;