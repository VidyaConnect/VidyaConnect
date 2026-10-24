import axios from 'axios';

function makeError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function adminConfig() {
  const tokenUrl = process.env.KEYCLOAK_TOKEN_URL;
  const match = tokenUrl && tokenUrl.match(/^(.*)\/realms\/([^/]+)\/protocol\/openid-connect\/token$/);
  if (!match || !process.env.KEYCLOAK_CLIENT_ID || !process.env.KEYCLOAK_CLIENT_SECRET) {
    console.error('Keycloak admin configuration is incomplete');
    throw makeError(500, 'Unable to complete the request right now');
  }
  return { tokenUrl, adminBase: `${match[1]}/admin/realms/${match[2]}` };
}

async function getServiceToken(tokenUrl) {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', process.env.KEYCLOAK_CLIENT_ID);
  params.append('client_secret', process.env.KEYCLOAK_CLIENT_SECRET);
  try {
    const res = await axios.post(tokenUrl, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return res.data.access_token;
  } catch (err) {
    console.error('Keycloak service token failed:', err.response?.status, err.response?.data?.error);
    throw makeError(500, 'Unable to complete the request right now');
  }
}

async function adminContext() {
  const { tokenUrl, adminBase } = adminConfig();
  const token = await getServiceToken(tokenUrl);
  return { adminBase, headers: { Authorization: `Bearer ${token}` } };
}

export async function resetUserPassword(keycloakId, newPassword) {
  const { adminBase, headers } = await adminContext();
  try {
    await axios.put(
      `${adminBase}/users/${encodeURIComponent(keycloakId)}/reset-password`,
      { type: 'password', value: newPassword, temporary: false },
      { headers }
    );
  } catch (err) {
    const status = err.response?.status;
    if (status === 400) {
      throw makeError(400, err.response.data?.error_description || 'New password does not meet the password policy.');
    }
    console.error('Keycloak reset-password failed:', status, err.response?.data?.errorMessage || err.message);
    throw makeError(500, 'Unable to change password right now');
  }
}

// Updates name and/or email (email is also the Keycloak username)
export async function updateKeycloakUser(keycloakId, { fullName, email }) {
  const { adminBase, headers } = await adminContext();
  const url = `${adminBase}/users/${encodeURIComponent(keycloakId)}`;
  try {
    const { data: current } = await axios.get(url, { headers });
    const updated = { ...current };
    if (fullName !== undefined) {
      const parts = fullName.trim().split(/\s+/);
      updated.firstName = parts[0];
      updated.lastName = parts.slice(1).join(' ');
    }
    if (email !== undefined) {
      updated.email = email;
      updated.username = email;
    }
    await axios.put(url, updated, { headers });
  } catch (err) {
    const status = err.response?.status;
    if (status === 409) throw makeError(409, 'That email is already in use.');
    console.error('Keycloak user update failed:', status, err.response?.data?.errorMessage || err.message);
    throw makeError(status === 400 ? 400 : 500, 'Unable to update your account right now');
  }
}
