import type { SubNavItem } from './SubNav'

export const schoolAdminMenu: SubNavItem[] = [
  { label: 'Overview', href: '/dashboard/school-admin' },
  { label: 'Announcements', href: '/announcements' },
  { label: 'Attendance', href: '/attendance/school-admin' },
  { label: 'Consent Forms', href: '#' },
  { label: 'Community', href: '#' },
  { label: 'Calendar', href: '#' },
  { label: 'Bulk Data', href: '#' },
  { label: 'Reports', href: '#' },
]

export const teacherMenu: SubNavItem[] = [
  { label: 'Overview', href: '/dashboard/teacher' },
  { label: 'Announcements', href: '/announcements' },
  { label: 'Attendance', href: '/attendance/teacher' },
  { label: 'Assignments', href: '#' },
  { label: 'Community', href: '#' },
  { label: 'Calendar', href: '#' },
  { label: 'Messages', href: '#' },
  { label: 'Reports', href: '#' },
]

export const adminMenu: SubNavItem[] = [
  { label: 'Overview', href: '/dashboard/admin' },
  { label: 'Announcements', href: '/announcements' },
  { label: 'School Requests', href: '#' },
  { label: 'System Reports', href: '#' },
  { label: 'Calendar', href: '#' },
  { label: 'Audit Logs', href: '#' },
]

export function getPortalMenu(role: 'teacher' | 'admin' | 'school-admin'): SubNavItem[] {
  if (role === 'teacher') return teacherMenu
  if (role === 'admin') return adminMenu
  return schoolAdminMenu
}