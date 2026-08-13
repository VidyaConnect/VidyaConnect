'use client'

import {
  DashboardIcon,
  ClassesIcon,
  AnnouncementsIcon,
  CommunityIcon,
  AttendanceIcon,
  AssignmentsIcon,
  ConsentIcon,
  CalendarIcon,
  ReportsIcon,
  SettingsIcon,
  SchoolsIcon,
  ProfileIcon,
  LogoutIcon,
} from './Icons'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
}

interface NavbarProps {
  userRole: 'teacher' | 'admin' | 'super-admin'
  currentPage: string
  onNavigate: (page: string) => void
}

export default function Navbar({ userRole, currentPage, onNavigate }: NavbarProps) {
  const teacherMenuItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon size={18} /> },
    { id: 'my-classes', label: 'My Classes', icon: <ClassesIcon size={18} /> },
    { id: 'announcements', label: 'Announcements', icon: <AnnouncementsIcon size={18} /> },
    { id: 'messages', label: 'Community & Messages', icon: <CommunityIcon size={18} /> },
    { id: 'attendance', label: 'Mark Attendance', icon: <AttendanceIcon size={18} /> },
    { id: 'assignments', label: 'Manage Assignments', icon: <AssignmentsIcon size={18} /> },
    { id: 'consent', label: 'Consent Forms', icon: <ConsentIcon size={18} /> },
    { id: 'calendar', label: 'Class Calendar', icon: <CalendarIcon size={18} /> },
    { id: 'reports', label: 'Reports', icon: <ReportsIcon size={18} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={18} /> },
  ]

  const adminMenuItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon size={18} /> },
    { id: 'schools', label: 'Schools', icon: <SchoolsIcon size={18} /> },
    { id: 'announcements', label: 'Announcements', icon: <AnnouncementsIcon size={18} /> },
    { id: 'consent', label: 'Consent Forms', icon: <ConsentIcon size={18} /> },
    { id: 'attendance', label: 'Attendance', icon: <AttendanceIcon size={18} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={18} /> },
  ]

  const superAdminMenuItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon size={18} /> },
    { id: 'school-registry', label: 'School Registry', icon: <SchoolsIcon size={18} /> },
    { id: 'schools', label: 'Schools', icon: <SchoolsIcon size={18} /> },
    { id: 'admin-management', label: 'Admin Management', icon: <ProfileIcon size={18} /> },
    { id: 'school-requests', label: 'School Requests', icon: <ConsentIcon size={18} /> },
    { id: 'announcements', label: 'Announcements', icon: <AnnouncementsIcon size={18} /> },
    { id: 'system-reports', label: 'System Reports', icon: <ReportsIcon size={18} /> },
    { id: 'system-settings', label: 'System Settings', icon: <SettingsIcon size={18} /> },
    { id: 'audit-logs', label: 'Audit Logs', icon: <ReportsIcon size={18} /> },
  ]

  const menuItems =
    userRole === 'teacher'
      ? teacherMenuItems
      : userRole === 'super-admin'
      ? superAdminMenuItems
      : adminMenuItems

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-56 flex-col border-r border-[#0b3c78] bg-[#073b78] text-white">
      <div className="px-5 pb-6 pt-6">
        <h1 className="text-xl font-bold leading-none text-white">
          VidyaConnect
        </h1>
        <p className="mt-1.5 text-sm text-[#b9cbe2]">
          {userRole === 'teacher' ? 'Teacher Portal' : userRole === 'super-admin' ? 'Super Admin Portal' : 'Admin Portal'}
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {menuItems.map((item) => {
          const active = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                active ? 'bg-[#007c6d] text-white' : 'text-[#d6e3f2] hover:bg-[#0c4b8f]'
              }`}
            >
              <span className="flex-none">{item.icon}</span>
              <span className="leading-snug">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="space-y-1 border-t border-[#0b4d8f] px-3 py-4">
        <button className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-[#d6e3f2] hover:bg-[#0c4b8f]">
          <ProfileIcon size={18} />
          Profile
        </button>
        <button className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-[#d6e3f2] hover:bg-[#0c4b8f]">
          <LogoutIcon size={18} />
          Logout
        </button>
      </div>
    </aside>
  )
}
