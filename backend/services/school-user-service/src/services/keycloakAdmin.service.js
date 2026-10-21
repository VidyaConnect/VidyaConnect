import axios from 'axios';

function makeError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

// Builds the Admin API address from the token URL that already exists in the environment
function adminConfig() {
  const tokenUrl = process.env.KEYCLOAK_TOKEN_URL;
  const match = tokenUrl && tokenUrl.match(/^(.*)\/realms\/([^/]+)\/protocol\/openid-connect\/token$/);
  if (!match || !process.env.KEYCLOAK_CLIENT_ID || !process.env.KEYCLOAK_CLIENT_SECRET) {
    console.error('Keycloak admin configuration is incomplete');
    throw makeError(500, 'Unable to change password right now');
  }
  return { tokenUrl, adminBase: `${match[1]}/admin/realms/${match[2]}` };
}

// Gets a token for the service itself (not for the user)
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
    throw makeError(500, 'Unable to change password right now');
  }
}

export async function resetUserPassword(keycloakId, newPassword) {
  const { tokenUrl, adminBase } = adminConfig();
  const token = await getServiceToken(tokenUrl);
  try {
    await axios.put(
      `${adminBase}/users/${encodeURIComponent(keycloakId)}/reset-password`,
      { type: 'password', value: newPassword, temporary: false },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (err) {
    const status = err.response?.status;
    if (status === 400) {
      // Keycloak's own password policy rejected it
      throw makeError(400, err.response.data?.error_description || 'New password does not meet the password policy.');
    }
    // Never log the password itself
    console.error('Keycloak reset-password failed:', status, err.response?.data?.errorMessage || err.message);
    throw makeError(500, 'Unable to change password right now');
  }
}
