'use client'

import { useState } from 'react'
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
  badge?: number
}

interface NavbarProps {
  userRole: 'teacher' | 'admin'
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
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon size={20} /> },
    { id: 'schools', label: 'Schools', icon: <SchoolsIcon size={20} /> },
    { id: 'announcements', label: 'Announcements', icon: <AnnouncementsIcon size={20} /> },
    { id: 'consent', label: 'Consent Forms', icon: <ConsentIcon size={20} /> },
    { id: 'attendance', label: 'Attendance', icon: <AttendanceIcon size={20} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={20} /> },
  ]

  const menuItems = userRole === 'teacher' ? teacherMenuItems : adminMenuItems

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-950 text-white min-h-screen fixed left-0 top-0 p-6 shadow-lg border-r border-blue-800 flex flex-col">
      {/* Logo Section */}
      <div className="mb-8 pb-6 border-b border-blue-800">
        <h1 className="text-2xl font-bold mb-1">VidyaConnect</h1>
        <p className="text-sm text-blue-200">
          {userRole === 'teacher' ? 'Teacher Portal' : 'Admin Portal'}
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-1 flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 group ${
              currentPage === item.id
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-blue-100 hover:bg-blue-800/50 hover:text-white'
            }`}
          >
            <span className={`flex-shrink-0 ${currentPage === item.id ? 'text-white' : 'text-blue-300 group-hover:text-blue-100'}`}>
              {item.icon}
            </span>
            <span className="text-sm font-medium">{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-blue-800 pt-4 space-y-2">
        <button className="w-full text-left px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800/50 transition-colors flex items-center gap-3 group">
          <ProfileIcon size={20} className="text-blue-300 group-hover:text-blue-100" />
          <span className="text-sm font-medium">Profile</span>
        </button>
        <button className="w-full text-left px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800/50 transition-colors flex items-center gap-3 group">
          <LogoutIcon size={20} className="text-blue-300 group-hover:text-blue-100" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
