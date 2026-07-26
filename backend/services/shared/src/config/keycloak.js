import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: process.env.KEYCLOAK_JWKS_URI,
  cache: true,
  cacheMaxAge: 600000, // 10 minutes
  rateLimit: true,
  jwksRequestsPerMinute: 10,
});

/**
 * Returns the public signing key for JWT verification.
 */
export function getSigningKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }

    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}