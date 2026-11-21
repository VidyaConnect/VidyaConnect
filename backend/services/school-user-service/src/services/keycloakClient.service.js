import 'dotenv/config';
import axios from 'axios';

const TOKEN_URL = process.env.KEYCLOAK_TOKEN_URL;
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID;
const CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET;

if (!TOKEN_URL || !TOKEN_URL.includes('/realms/')) {
  throw new Error(
    'KEYCLOAK_TOKEN_URL is missing or invalid (expected e.g. http://host:8080/realms/<realm>/protocol/openid-connect/token)',
  );
}
if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error('KEYCLOAK_CLIENT_ID and KEYCLOAK_CLIENT_SECRET must be set');
}

const HTTP_TIMEOUT = 10000; // ms
const FORM_HEADERS = { 'Content-Type': 'application/x-www-form-urlencoded' };

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
      headers: FORM_HEADERS,
      timeout: HTTP_TIMEOUT,
    });
    return response.data;
  } catch (err) {
    if (err.response) {
      const wrappedError = new Error(err.response.data?.error_description || 'Authentication failed');
      wrappedError.status = 401;
      throw wrappedError;
    }
    console.error('Keycloak login request failed:', err.message, err.code);
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
      headers: FORM_HEADERS,
      timeout: HTTP_TIMEOUT,
    });
    return response.data;
  } catch (err) {
    if (err.response) {
      const wrappedError = new Error(
        err.response.data?.error_description || 'Session expired. Please login again',
      );
      wrappedError.status = 401;
      throw wrappedError;
    }
    const wrappedError = new Error('Unable to reach authentication server');
    wrappedError.status = 503;
    throw wrappedError;
  }
}

// ---- Keycloak Admin API (used for signup, bulk registration, forgot-password, etc.) ----

const KEYCLOAK_BASE_URL = TOKEN_URL.split('/realms/')[0];
const KEYCLOAK_REALM = TOKEN_URL.split('/realms/')[1].split('/')[0];
const ADMIN_USERS_URL = `${KEYCLOAK_BASE_URL}/admin/realms/${KEYCLOAK_REALM}/users`;
const ADMIN_ROLES_URL = `${KEYCLOAK_BASE_URL}/admin/realms/${KEYCLOAK_REALM}/roles`;

let cachedAdminToken = null;
let adminTokenExpiresAt = 0;
let adminTokenPromise = null; // shared in-flight request so parallel callers fetch only one token

/**
 * Gets a service-account token (client credentials grant).
 * Cached until shortly before it expires.
 */
export async function getAdminToken() {
  if (cachedAdminToken && Date.now() < adminTokenExpiresAt) {
    return cachedAdminToken;
  }
  if (adminTokenPromise) return adminTokenPromise;

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);

  adminTokenPromise = axios
    .post(TOKEN_URL, params, { headers: FORM_HEADERS, timeout: HTTP_TIMEOUT })
    .then((response) => {
      cachedAdminToken = response.data.access_token;
      adminTokenExpiresAt = Date.now() + (response.data.expires_in - 30) * 1000;
      return cachedAdminToken;
    })
    .catch((err) => {
      console.error(
        'Keycloak admin token request failed:',
        err.response?.status,
        JSON.stringify(err.response?.data) || err.message,
      );
      const wrapped = new Error('Unable to authenticate with identity service');
      wrapped.status = 503;
      throw wrapped;
    })
    .finally(() => {
      adminTokenPromise = null;
    });

  return adminTokenPromise;
}

/**
 * Creates a user in Keycloak and returns the new Keycloak user id.
 * Throws status 409 if the email already exists, 400 if Keycloak rejects the data
 * (for example a password policy or invalid email).
 * temporary: true makes Keycloak require a password change (blocks direct-grant login until done).
 * attributes: optional Keycloak user attributes, e.g. { school_id: ['abc'] }.
 */
export async function createKeycloakUser({ email, password, fullName, temporary = false, attributes }) {
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
        credentials: [{ type: 'password', value: password, temporary }],
        ...(attributes ? { attributes } : {}),
      },
      { headers: { Authorization: `Bearer ${token}` }, timeout: HTTP_TIMEOUT },
    );

    // Keycloak returns the new user's URL in the Location header
    const location = response.headers.location;
    return location.substring(location.lastIndexOf('/') + 1);
  } catch (err) {
    const status = err.response?.status;
    if (status === 409) {
      const conflict = new Error('An account with this email already exists');
      conflict.status = 409;
      throw conflict;
    }
    if (status === 400) {
      const bad = new Error(err.response.data?.errorMessage || 'Identity service rejected the account details');
      bad.status = 400;
      throw bad;
    }
    if (status === 403) {
      const forbidden = new Error('Identity service is not configured to create users');
      forbidden.status = 500;
      throw forbidden;
    }
    console.error('Keycloak createUser failed:', status, JSON.stringify(err.response?.data) || err.message);
    const wrapped = new Error('Unable to create account right now');
    wrapped.status = 503;
    throw wrapped;
  }
}

/**
 * Deletes a Keycloak user. Used to roll back when the database insert fails.
 * Never throws, so it cannot hide the original error that triggered the rollback.
 */
export async function deleteKeycloakUser(keycloakId) {
  try {
    const token = await getAdminToken();
    await axios.delete(`${ADMIN_USERS_URL}/${keycloakId}`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: HTTP_TIMEOUT,
    });
  } catch (err) {
    console.error('Failed to roll back Keycloak user', keycloakId, err.message);
  }
}

/**
 * Gives a Keycloak user one realm role (for example TEACHER or PARENT).
 */
export async function assignRealmRole(keycloakId, roleName) {
  const token = await getAdminToken();
  const headers = { Authorization: `Bearer ${token}` };

  try {
    // 1. Look up the role to get its ID
    const roleResponse = await axios.get(`${ADMIN_ROLES_URL}/${encodeURIComponent(roleName)}`, {
      headers,
      timeout: HTTP_TIMEOUT,
    });

    // 2. Attach the role to the user
    await axios.post(
      `${ADMIN_USERS_URL}/${keycloakId}/role-mappings/realm`,
      [{ id: roleResponse.data.id, name: roleResponse.data.name }],
      { headers, timeout: HTTP_TIMEOUT },
    );
  } catch (err) {
    const status = err.response?.status;
    console.error('Failed to assign Keycloak role', roleName, status, err.message);

    let message = 'Unable to set up the account role';
    if (status === 404) message = `Role "${roleName}" does not exist in Keycloak`;
    else if (status === 403) message = 'Identity service is not allowed to assign roles';

    const wrapped = new Error(message);
    wrapped.status = status === 404 || status === 403 ? 500 : 503;
    throw wrapped;
  }
}

/**
 * Enables or disables a Keycloak account (used when a teacher is removed from the school).
 * Disabling a user that no longer exists in Keycloak counts as success.
 */
export async function setKeycloakUserEnabled(keycloakId, enabled) {
  const token = await getAdminToken();
  const headers = { Authorization: `Bearer ${token}` };
  try {
    // Read the full user first: some Keycloak versions reject a partial update.
    const current = await axios.get(`${ADMIN_USERS_URL}/${keycloakId}`, { headers, timeout: HTTP_TIMEOUT });
    await axios.put(
      `${ADMIN_USERS_URL}/${keycloakId}`,
      { ...current.data, enabled },
      { headers, timeout: HTTP_TIMEOUT },
    );
  } catch (err) {
    const status = err.response?.status;
    if (status === 404 && !enabled) return;
    console.error('Keycloak enable/disable failed', keycloakId, status, JSON.stringify(err.response?.data) || err.message);
    const wrapped = new Error('Unable to update the account right now');
    wrapped.status = 503;
    throw wrapped;
  }
}