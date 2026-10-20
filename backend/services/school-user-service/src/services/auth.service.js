import jwt from 'jsonwebtoken';
import { getSigningKey } from '@vidyaconnect/shared';
import {
  findUserByKeycloakId,
  findUserByEmail,
  createParentUser,
} from '../repositories/user.repository.js';
import {
  requestTokenWithPassword,
  requestTokenWithRefresh,
  createKeycloakUser,
  deleteKeycloakUser,
  assignRealmRole,
} from './keycloakClient.service.js';
/**
 * Verifies an access token's signature using Keycloak's JWKS,
 * and returns its decoded payload if valid.
 *
 * @param {string} accessToken
 * @returns {Promise<object>} decoded JWT payload
 * @throws {Error} with `.status` set, if verification fails
 */
function verifyAndDecodeToken(accessToken) {
  return new Promise((resolve, reject) => {
    const decodedHeader = jwt.decode(accessToken, { complete: true });

    if (!decodedHeader || !decodedHeader.header) {
      const err = new Error('Invalid access token received from Keycloak');
      err.status = 500;
      return reject(err);
    }

    getSigningKey(decodedHeader.header, (err, signingKey) => {
      if (err) {
        const wrappedError = new Error('Unable to verify access token');
        wrappedError.status = 500;
        return reject(wrappedError);
      }

      jwt.verify(
        accessToken,
        signingKey,
        { algorithms: ['RS256'] },
        (verifyErr, decoded) => {
          if (verifyErr) {
            const wrappedError = new Error('Access token verification failed');
            wrappedError.status = 500;
            return reject(wrappedError);
          }
          resolve(decoded);
        }
      );
    });
  });
}

/**
 * Loads the local User record by keycloakId and validates
 * the account and school are active.
 *
 * @param {string} keycloakId
 * @returns {Promise<object>} the validated User record (with school, student, teacher, parent relations)
 * @throws {Error} with `.status = 401` if user/school not found or inactive
 */
async function loadAndValidateUser(keycloakId) {
  const user = await findUserByKeycloakId(keycloakId);

  if (!user) {
    const err = new Error('No local account found for this user');
    err.status = 401;
    throw err;
  }

  if (!user.isActive) {
    const err = new Error('This account has been deactivated');
    err.status = 401;
    throw err;
  }

  if (user.school && !user.school.isActive) {
    const err = new Error('This school account has been deactivated');
    err.status = 401;
    throw err;
  }

  return user;
}

function buildLoginResponse(tokens, user) {
  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresIn: tokens.expires_in,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    school: user.school
      ? {
          id: user.school.id,
          name: user.school.name,
          email: user.school.email,
        }
      : null,
  };
}

/**
 * Full login flow: authenticates with Keycloak, verifies the token,
 * loads and validates the local user, and builds the response.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} the login response payload
 * @throws {Error} with `.status` set, from any step in the chain
 */
async function login(email, password) {
  const tokens = await requestTokenWithPassword(email, password);
  const decoded = await verifyAndDecodeToken(tokens.access_token);
  const user = await loadAndValidateUser(decoded.sub);
  return buildLoginResponse(tokens, user);
}

async function refresh(refreshToken) {
  const tokens = await requestTokenWithRefresh(refreshToken);
  const decoded = await verifyAndDecodeToken(tokens.access_token);
  const user = await loadAndValidateUser(decoded.sub);
  return buildLoginResponse(tokens, user);
}

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PHONE_REGEX = /^\+?\d{9,15}$/;

function badRequest(message) {
  const err = new Error(message);
  err.status = 400;
  return err;
}

/**
 * Self-signup for parents. Creates the Keycloak account and the local
 * User + Parent rows. If the database step fails, the Keycloak account
 * is deleted so no half-created account is left behind.
 */
async function registerParent({ fullName, email, phone, password }) {
  const name = fullName?.trim();
  const mail = email?.trim().toLowerCase();
  const phoneNo = phone?.trim();

  if (!name || !mail || !phoneNo || !password) {
    throw badRequest('Full name, email, phone and password are required');
  }
  if (!EMAIL_REGEX.test(mail)) throw badRequest('Please enter a valid email address');
  if (!PHONE_REGEX.test(phoneNo)) throw badRequest('Please enter a valid phone number');
  if (password.length < 8) throw badRequest('Password must be at least 8 characters');

  if (await findUserByEmail(mail)) {
    const err = new Error('An account with this email already exists');
    err.status = 409;
    throw err;
  }

  const keycloakId = await createKeycloakUser({ email: mail, password, fullName: name });

  try {
    await assignRealmRole(keycloakId, 'PARENT');
  } catch (roleErr) {
    await deleteKeycloakUser(keycloakId); // no half-created account
    throw roleErr;
  }

  try {
    const user = await createParentUser({
      keycloakId,
      fullName: name,
      email: mail,
      phone: phoneNo,
    });
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };
  } catch (dbErr) {
    await deleteKeycloakUser(keycloakId);
    if (dbErr.code === 'P2002') {
      const err = new Error('An account with this email already exists');
      err.status = 409;
      throw err;
    }
    throw dbErr;
  }
}

export { verifyAndDecodeToken, loadAndValidateUser, buildLoginResponse, login, refresh, registerParent};