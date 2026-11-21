'use client';

import { useAuth } from '@/features/auth/hooks/userAuth';
import { CalendarRole } from '../types';

const ROLES: CalendarRole[] = ['ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'PARENT'];

// Accepts "SCHOOL_ADMIN", "school-admin", "School Admin", etc.
export function normalizeRole(raw?: string | null): CalendarRole | null {
  if (!raw) return null;
  const r = raw.trim().toUpperCase().replace(/[\s-]+/g, '_') as CalendarRole;
  return ROLES.includes(r) ? r : null;
}

export function useCurrentRole() {
  const { user, isInitialized } = useAuth();
  const role = normalizeRole(user?.role as string | undefined);
  return { role, ready: isInitialized };
}