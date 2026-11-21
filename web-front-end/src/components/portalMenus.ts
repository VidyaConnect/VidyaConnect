import type { SubNavItem } from './SubNav'

export const schoolAdminMenu: SubNavItem[] = [
  { label: 'Overview', href: '/dashboard/school-admin' },
  { label: 'Announcements', href: '/announcements/school-admin' },
  { label: 'Attendance', href: '/attendance/school-admin' },
  { label: 'Consent Forms', href: '#' },
  { label: 'Community', href: '#' },
  { label: 'Calendar', href: '/calendar/school-admin' },
  { label: 'Bulk Registration', href: '/bulk-registration' },
  { label: 'Academics', href: '/academics' },
  { label: 'Reports', href: '#' },
]

export const teacherMenu: SubNavItem[] = [
  { label: 'Overview', href: '/dashboard/teacher' },
  { label: 'Announcements', href: '/announcements/teacher-feed' },
  { label: 'Attendance', href: '/attendance/teacher' },
  { label: 'Assignments', href: '#' },
  { label: 'Community', href: '#' },
  { label: 'Calendar', href: '/calendar/teacher' },
  { label: 'Messages', href: '#' },
  { label: 'Reports', href: '#' },
  { label: 'Parent Requests', href: '/parent-requests/teacher' }
]

export const adminMenu: SubNavItem[] = [
  { label: 'Overview', href: '/dashboard/admin' },
  { label: 'Announcements', href: '/announcements/admin' },
  { label: 'School Requests', href: '/school-requests' },
  { label: 'System Reports', href: '#' },
  { label: 'Calendar', href: '/calendar/admin' },
  { label: 'Audit Logs', href: '#' },
]

export function getPortalMenu(role: 'teacher' | 'admin' | 'school-admin'): SubNavItem[] {
  if (role === 'teacher') return teacherMenu
  if (role === 'admin') return adminMenu
  return schoolAdminMenu
}