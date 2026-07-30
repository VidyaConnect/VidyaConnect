import 'dotenv/config';
import axios from 'axios';

console.log('DEBUG keycloakClient - TOKEN_URL:', process.env.KEYCLOAK_TOKEN_URL);
console.log('DEBUG keycloakClient - CLIENT_ID:', process.env.KEYCLOAK_CLIENT_ID);

const TOKEN_URL = process.env.KEYCLOAK_TOKEN_URL;
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID;
const CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET;

/**
 * Exchanges user email/password for tokens via Keycloak's
 * Resource Owner Password Credentials (direct grant) flow.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{access_token, refresh_token, id_token, expires_in}>}
 * @throws {Error} with `.status` set, for the caller to translate into an HTTP response
 */
export async function requestTokenWithPassword(email, password) {
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  params.append('username', email);
  params.append('password', password);

  try {
    const response = await axios.post(TOKEN_URL, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return response.data;
  } catch (err) {
    if (err.response) {
      const keycloakError = err.response.data?.error_description || 'Authentication failed';
      const wrappedError = new Error(keycloakError);
      wrappedError.status = 401;
      throw wrappedError;
    }

    console.error('RAW ERROR:', err.message, err.code);
    const wrappedError = new Error('Unable to reach authentication server');
    wrappedError.status = 503;
    throw wrappedError;
  }
}