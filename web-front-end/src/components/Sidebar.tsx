interface SidebarProps {
  userRole: 'teacher' | 'admin'
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

  const menuItems = userRole === 'teacher' ? teacherMenuItems : adminMenuItems

  return (
    <aside className="w-64 bg-blue-900 text-white min-h-screen fixed left-0 top-0 p-6">
      <h1 className="text-2xl font-bold mb-8">
        <span className="block">VidyaConnect</span>
        <span className="text-sm font-normal text-blue-200">
          {userRole === 'teacher' ? 'Teacher Portal' : 'Admin Portal'}
        </span>
      </h1>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              currentPage === item.id
                ? 'bg-teal-600 text-white'
                : 'text-blue-100 hover:bg-blue-800'
            }`}
          >
            <span className="inline-block mr-3">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-6 left-6 right-6 border-t border-blue-800 pt-4">
        <button className="w-full text-left px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-colors">
          👤 Profile
        </button>
        <button className="w-full text-left px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-colors">
          🚪 Logout
        </button>
      </div>
    </aside>
  )
}
