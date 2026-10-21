import { login, refresh } from '../services/auth.service.js';
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