interface SidebarProps {
  userRole: 'teacher' | 'admin' | 'super-admin'
  currentPage: string
  onNavigate: (page: string) => void
}

export default function Sidebar({ userRole, currentPage, onNavigate }: SidebarProps) {
  const teacherMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'my-classes', label: 'My Classes', icon: '👥' },
    { id: 'announcements', label: 'Announcements', icon: '📢' },
    { id: 'messages', label: 'Community & Messages', icon: '💬' },
    { id: 'attendance', label: 'Mark Attendance', icon: '✓' },
    { id: 'assignments', label: 'Manage Assignments', icon: '📝' },
    { id: 'consent', label: 'Consent Forms', icon: '📋' },
    { id: 'calendar', label: 'Class Calendar', icon: '📅' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'schools', label: 'Schools', icon: '🏫' },
    { id: 'announcements', label: 'Announcements', icon: '📢' },
    { id: 'consent', label: 'Consent Forms', icon: '📋' },
    { id: 'attendance', label: 'Attendance', icon: '✓' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  const superAdminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'school-registry', label: 'School Registry', icon: '🏛️' },
    { id: 'schools', label: 'Schools', icon: '🏫' },
    { id: 'admin-management', label: 'Admin Management', icon: '👤' },
    { id: 'school-requests', label: 'School Requests', icon: '📝' },
    { id: 'announcements', label: 'Announcements', icon: '📢' },
    { id: 'system-reports', label: 'System Reports', icon: '📈' },
    { id: 'system-settings', label: 'System Settings', icon: '⚙️' },
    { id: 'audit-logs', label: 'Audit Logs', icon: '🕒' },
  ]

  const menuItems =
    userRole === 'teacher'
      ? teacherMenuItems
      : userRole === 'super-admin'
      ? superAdminMenuItems
      : adminMenuItems

  return (
    <aside className="fixed left-0 top-0 min-h-screen w-56 bg-blue-900 p-4 text-white">
      <h1 className="mb-6 text-xl font-bold">
        <span className="block">VidyaConnect</span>
        <span className="text-xs font-normal text-blue-200">
          {userRole === 'teacher'
            ? 'Teacher Portal'
            : userRole === 'super-admin'
            ? 'Super Admin Portal'
            : 'Admin Portal'}
        </span>
      </h1>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
              currentPage === item.id
                ? 'bg-teal-600 text-white'
                : 'text-blue-100 hover:bg-blue-800'
            }`}
          >
            <span className="mr-2 inline-block">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4 border-t border-blue-800 pt-3">
        <button className="w-full rounded-md px-3 py-2 text-left text-sm text-blue-100 transition-colors hover:bg-blue-800">
          👤 Profile
        </button>
        <button className="w-full rounded-md px-3 py-2 text-left text-sm text-blue-100 transition-colors hover:bg-blue-800">
          🚪 Logout
        </button>
      </div>
    </aside>
  )
}
