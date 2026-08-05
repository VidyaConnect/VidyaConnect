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
  HelpIcon,
  DownloadIcon,
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
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon size={20} /> },
    { id: 'my-classes', label: 'My Classes', icon: <ClassesIcon size={20} /> },
    { id: 'announcements', label: 'Announcements', icon: <AnnouncementsIcon size={20} /> },
    { id: 'messages', label: 'Community & Messages', icon: <CommunityIcon size={20} /> },
    { id: 'attendance', label: 'Mark Attendance', icon: <AttendanceIcon size={20} /> },
    { id: 'assignments', label: 'Manage Assignments', icon: <AssignmentsIcon size={20} /> },
    { id: 'consent', label: 'Consent Forms', icon: <ConsentIcon size={20} /> },
    { id: 'calendar', label: 'Class Calendar', icon: <CalendarIcon size={20} /> },
    { id: 'reports', label: 'Reports', icon: <ReportsIcon size={20} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={20} /> },
  ]

  const adminMenuItems: NavItem[] = [
    { id: 'dashboard', label: 'Overview', icon: <DashboardIcon size={20} /> },
    { id: 'announcements', label: 'Announcements', icon: <AnnouncementsIcon size={20} /> },
    { id: 'consent', label: 'Consent Forms', icon: <ConsentIcon size={20} /> },
    { id: 'attendance', label: 'Attendance', icon: <AttendanceIcon size={20} /> },
    { id: 'community', label: 'Community', icon: <CommunityIcon size={20} /> },
    { id: 'billing', label: 'Billing & Payments', icon: <ConsentIcon size={20} /> },
    { id: 'bulk-data', label: 'Bulk Data', icon: <ClassesIcon size={20} /> },
    { id: 'reports', label: 'Reports', icon: <ReportsIcon size={20} /> },
  ]

  const superAdminMenuItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon size={20} /> },
    { id: 'school-registry', label: 'School Registry', icon: <SchoolsIcon size={20} /> },
    { id: 'schools', label: 'Schools', icon: <ClassesIcon size={20} /> },
    { id: 'admin-management', label: 'Admin Management', icon: <ProfileIcon size={20} /> },
    { id: 'school-requests', label: 'School Requests', icon: <ConsentIcon size={20} /> },
    { id: 'announcements', label: 'Announcements', icon: <AnnouncementsIcon size={20} /> },
    { id: 'system-reports', label: 'System Reports', icon: <ReportsIcon size={20} /> },
    { id: 'system-settings', label: 'System Settings', icon: <SettingsIcon size={20} /> },
    { id: 'audit-logs', label: 'Audit Logs', icon: <CalendarIcon size={20} /> },
  ]

  const menuItems =
    userRole === 'teacher'
      ? teacherMenuItems
      : userRole === 'admin'
      ? adminMenuItems
      : superAdminMenuItems

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-[#0b3c78] bg-[#073b78] text-white">
      <div className="px-8 pb-6 pt-6 flex-none">
        <h1 className="text-2xl font-bold leading-none text-white tracking-tight">VidyaConnect</h1>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#b9cbe2]">
          {userRole === 'teacher'
            ? 'Teacher Portal'
            : userRole === 'admin'
            ? 'Admin Portal'
            : 'Super Admin Portal'}
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-4 overflow-hidden">
        {menuItems.map((item) => {
          const active = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-semibold transition-colors ${
                active
                  ? 'bg-[#007c6d] text-white shadow-sm'
                  : 'text-[#d6e3f2] hover:bg-[#0c4b8f] hover:text-white'
              }`}
            >
              <span className="flex-none opacity-85">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          )}
        )}

        {/* Floating Green announcement button for Super Admin */}
        {userRole === 'super-admin' && (
          <div className="pt-4 px-2">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#00a896] hover:bg-[#009686] py-3 text-sm font-bold text-white shadow-md transition-all">
              <span>+</span> New Announcement
            </button>
          </div>
        )}
      </nav>

      {/* Dynamic footer based on user role */}
      <div className="flex-none border-t border-[#0b4d8f] px-6 py-4 space-y-1">
        {userRole === 'admin' && (
          <>
            <button className="mb-2 flex w-full items-center justify-center gap-2 rounded bg-[#002d62] hover:bg-[#003b78] py-2 text-sm font-bold text-white shadow-sm transition-colors border border-[#0b4d8f]">
              <DownloadIcon size={14} />
              Export Report
            </button>
            <button className="flex w-full items-center gap-3 rounded px-4 py-2 text-left text-sm text-[#d6e3f2] hover:bg-[#0c4b8f] hover:text-white transition-colors">
              <HelpIcon size={18} />
              Help Center
            </button>
            <button className="flex w-full items-center gap-3 rounded px-4 py-2 text-left text-sm text-[#d6e3f2] hover:bg-[#0c4b8f] hover:text-white transition-colors">
              <LogoutIcon size={18} />
              Log Out
            </button>
          </>
        )}

        {userRole === 'super-admin' && (
          <>
            <button className="flex w-full items-center gap-3 rounded px-4 py-2 text-left text-sm text-[#d6e3f2] hover:bg-[#0c4b8f] hover:text-white transition-colors">
              <HelpIcon size={18} />
              Support
            </button>
            <button className="flex w-full items-center gap-3 rounded px-4 py-2 text-left text-sm text-[#d6e3f2] hover:bg-[#0c4b8f] hover:text-white transition-colors">
              <LogoutIcon size={18} />
              Logout
            </button>
          </>
        )}

        {userRole === 'teacher' && (
          <button className="flex w-full items-center gap-3 rounded px-4 py-2 text-left text-sm text-[#d6e3f2] hover:bg-[#0c4b8f] hover:text-white transition-colors">
            <LogoutIcon size={18} />
            Logout
          </button>
        )}
      </div>
    </aside>
  )
}
