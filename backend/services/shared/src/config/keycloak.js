import jwksClient from 'jwks-rsa';

let client;

// Created lazily so process.env is already loaded when it first runs
function getClient() {
  if (!client) {
    client = jwksClient({
      jwksUri: process.env.KEYCLOAK_JWKS_URI,
      cache: true,
      cacheMaxAge: 600000, // 10 minutes
      rateLimit: true,
      jwksRequestsPerMinute: 10
    });
  }
  return client;
}

// Accepts either the kid string or the whole decoded JWT header
export function getSigningKey(kidOrHeader, callback) {
  const kid = typeof kidOrHeader === 'string' ? kidOrHeader : kidOrHeader?.kid;
  getClient().getSigningKey(kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}