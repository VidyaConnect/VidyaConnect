// Maps Sidebar's internal page IDs to actual Next.js routes
export const TEACHER_PAGE_ROUTES: Record<string, string> = {
  dashboard: '/teacher/dashboard',
  'my-classes': '/teacher/my-classes',
  announcements: '/announcements/teacher-feed',
  messages: '/teacher/community',
  attendance: '/teacher/attendance',
  assignments: '/teacher/assignments',
  consent: '/teacher/consent-forms',
  calendar: '/teacher/calendar',
  reports: '/teacher/reports',
  settings: '/teacher/settings',
};

export const ADMIN_PAGE_ROUTES: Record<string, string> = {
  dashboard: '/school-admin/dashboard',
  schools: '/school-admin/schools',
  announcements: '/announcements',
  consent: '/school-admin/consent-forms',
  attendance: '/school-admin/attendance',
  settings: '/school-admin/settings',
};

export const SUPER_ADMIN_PAGE_ROUTES: Record<string, string> = {
  dashboard: '/super-admin/dashboard',
  'school-registry': '/super-admin/school-registry',
  schools: '/super-admin/schools',
  'admin-management': '/super-admin/admin-management',
  'school-requests': '/super-admin/school-requests',
  announcements: '/announcements/super-admin-view',
  'system-reports': '/super-admin/system-reports',
  'system-settings': '/super-admin/system-settings',
  'audit-logs': '/super-admin/audit-logs',
};

export const STUDENT_PAGE_ROUTES: Record<string, string> = {
  dashboard: '/student/dashboard',
  'my-class': '/student/my-class',
  announcements: '/announcements/student-feed',
  messages: '/student/community',
  assignments: '/student/assignments',
  calendar: '/student/calendar',
  reports: '/student/reports',
  settings: '/student/settings',
};