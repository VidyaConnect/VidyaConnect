import {
  login,
  refresh,
  registerParent,
  registerSchoolAdmin,
  getMe,
  verifyAndDecodeToken,
} from '../services/auth.service.js';
import { successResponse, errorResponse } from '@vidyaconnect/shared';

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return errorResponse(res, 'Email and password are required', 400);
  }

  try {
    const result = await login(email, password);
    return successResponse(res, result, 'Login successful');
  } catch (err) {
    return errorResponse(res, err.message, err.status || 500);
  }
};

export const refreshController = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return errorResponse(res, 'Refresh token is required', 400);
  }

  try {
    const result = await refresh(refreshToken);
    return successResponse(res, result, 'Token refreshed');
  } catch (err) {
    return errorResponse(res, err.message, err.status || 500);
  }
};

export const registerParentController = async (req, res) => {
  // Note: any "role" sent in the body is ignored on purpose
  const { fullName, email, phone, password } = req.body;

  try {
    const result = await registerParent({ fullName, email, phone, password });
    return successResponse(res, result, 'Account created successfully');
  } catch (err) {
    return errorResponse(res, err.message, err.status || 500);
  }
};

export const registerSchoolAdminController = async (req, res) => {
  // Note: any "role" sent in the body is ignored on purpose.
  // The role is always SCHOOL_ADMIN, set inside the service.
  const { fullName, email, phone, password } = req.body;

  try {
    const result = await registerSchoolAdmin({ fullName, email, phone, password });
    return successResponse(res, result, 'Account created successfully');
  } catch (err) {
    return errorResponse(res, err.message, err.status || 500);
  }
};

/**
 * Returns the logged-in user's onboarding status and school info.
 * It checks the token itself, so a School Admin who has no school yet
 * is not blocked by the shared auth middleware.
 */
export const meController = async (req, res) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      const err = new Error('Not authenticated');
      err.status = 401;
      throw err;
    }

    let decoded;
    try {
      decoded = await verifyAndDecodeToken(token);
    } catch {
      const err = new Error('Your session has expired. Please sign in again.');
      err.status = 401;
      throw err;
    }

    const result = await getMe(decoded.sub);
    return successResponse(res, result, 'OK');
  } catch (err) {
    return errorResponse(res, err.message, err.status || 500);
  }
};