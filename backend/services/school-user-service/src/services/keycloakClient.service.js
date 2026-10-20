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

/**
 * Exchanges a refresh token for a new access token (and a new refresh token).
 */
export async function requestTokenWithRefresh(refreshToken) {
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  params.append('refresh_token', refreshToken);

  try {
    const response = await axios.post(TOKEN_URL, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  } catch (err) {
    if (err.response) {
      const wrappedError = new Error(
        err.response.data?.error_description || 'Session expired. Please login again'
      );
      wrappedError.status = 401;
      throw wrappedError;
    }
    const wrappedError = new Error('Unable to reach authentication server');
    wrappedError.status = 503;
    throw wrappedError;
  }
}

// ---- Keycloak Admin API (used for signup, forgot-password, etc.) ----

const KEYCLOAK_BASE_URL = TOKEN_URL.split('/realms/')[0];
const KEYCLOAK_REALM = TOKEN_URL.split('/realms/')[1].split('/')[0];
const ADMIN_USERS_URL = `${KEYCLOAK_BASE_URL}/admin/realms/${KEYCLOAK_REALM}/users`;
const ADMIN_ROLES_URL = `${KEYCLOAK_BASE_URL}/admin/realms/${KEYCLOAK_REALM}/roles`;

let cachedAdminToken = null;
let adminTokenExpiresAt = 0;

/**
 * Gets a service-account token (client credentials grant).
 * Cached until shortly before it expires.
 */
export async function getAdminToken() {
  if (cachedAdminToken && Date.now() < adminTokenExpiresAt) {
    return cachedAdminToken;
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);

  try {
    const response = await axios.post(TOKEN_URL, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    cachedAdminToken = response.data.access_token;
    adminTokenExpiresAt = Date.now() + (response.data.expires_in - 30) * 1000;
    return cachedAdminToken;
  } catch (err) {
    const wrapped = new Error('Unable to authenticate with identity service');
    wrapped.status = 503;
    throw wrapped;
  }
}

/**
 * Creates a user in Keycloak and returns the new Keycloak user id.
 * Throws status 409 if the email already exists.
 */
export async function createKeycloakUser({ email, password, fullName }) {
  const token = await getAdminToken();

  const nameParts = fullName.trim().split(/\s+/);
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || firstName;

  try {
    const response = await axios.post(
      ADMIN_USERS_URL,
      {
        username: email,
        email,
        firstName,
        lastName,
        enabled: true,
        emailVerified: true,
        credentials: [{ type: 'password', value: password, temporary: false }],
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Keycloak returns the new user's URL in the Location header
    const location = response.headers.location;
    return location.substring(location.lastIndexOf('/') + 1);
  } catch (err) {
    if (err.response?.status === 409) {
      const conflict = new Error('An account with this email already exists');
      conflict.status = 409;
      throw conflict;
    }
    if (err.response?.status === 403) {
      const forbidden = new Error('Identity service is not configured to create users');
      forbidden.status = 500;
      throw forbidden;
    }
    const wrapped = new Error('Unable to create account right now');
    wrapped.status = 503;
    throw wrapped;
  }
}

/**
 * Deletes a Keycloak user. Used to roll back when the database insert fails.
 */
export async function deleteKeycloakUser(keycloakId) {
  const token = await getAdminToken();
  try {
    await axios.delete(`${ADMIN_USERS_URL}/${keycloakId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.error('Failed to roll back Keycloak user', keycloakId, err.message);
  }
}

/**
 * Gives a Keycloak user one realm role (for example PARENT).
 */
export async function assignRealmRole(keycloakId, roleName) {
  const token = await getAdminToken();
  const headers = { Authorization: `Bearer ${token}` };

  try {
    // 1. Look up the role to get its ID
    const roleResponse = await axios.get(`${ADMIN_ROLES_URL}/${roleName}`, { headers });

    // 2. Attach the role to the user
    await axios.post(
      `${ADMIN_USERS_URL}/${keycloakId}/role-mappings/realm`,
      [{ id: roleResponse.data.id, name: roleResponse.data.name }],
      { headers }
    );
  } catch (err) {
    console.error('Failed to assign Keycloak role', roleName, err.response?.status, err.message);
    const wrapped = new Error('Unable to set up the account role');
    wrapped.status = 503;
    throw wrapped;
  }
}