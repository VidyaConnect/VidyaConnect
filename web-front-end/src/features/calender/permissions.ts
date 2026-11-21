import { CalendarPermissions, CalendarRole } from './types';

// UI-only: hides buttons. The backend enforces the real rules
// (teachers can only edit/delete their own events).
export const PERMISSIONS: Record<CalendarRole, CalendarPermissions> = {
  ADMIN: { canCreate: true, canEdit: true, canDelete: true },
  SCHOOL_ADMIN: { canCreate: true, canEdit: true, canDelete: true },
  TEACHER: { canCreate: true, canEdit: true, canDelete: true },
  PARENT: { canCreate: false, canEdit: false, canDelete: false },
};