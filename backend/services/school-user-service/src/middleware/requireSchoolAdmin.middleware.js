import prisma from '../config/prisma.js';
import { getKeycloakId } from './requestUser.js';

/**
 * Runs after auth. Finds the logged-in user in our database and only lets
 * active SCHOOL_ADMINs that belong to a school through.
 * It sets req.schoolAdmin = { userId, schoolId }; the school never comes from the request body.
 */
export async function requireSchoolAdmin(req, res, next) {
  try {
    const keycloakId = getKeycloakId(req);
    if (!keycloakId) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const user = await prisma.user.findUnique({
      where: { keycloakId },
      select: { id: true, role: true, schoolId: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return res.status(403).json({ success: false, message: 'Account not found or inactive' });
    }
    if (user.role !== 'SCHOOL_ADMIN') {
      return res.status(403).json({ success: false, message: 'Only school admins can do this' });
    }
    if (!user.schoolId) {
      return res.status(403).json({ success: false, message: 'No school linked to this account' });
    }

    req.schoolAdmin = { userId: user.id, schoolId: user.schoolId };
    next();
  } catch (err) {
    next(err);
  }
}