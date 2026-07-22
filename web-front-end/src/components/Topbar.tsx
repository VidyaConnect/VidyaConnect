'use client'

import { useState } from 'react'

interface TopbarProps {
  title: string
  subtitle?: string
  userRole: 'teacher' | 'admin'
  userName?: string
  userAvatar?: string
}

export default function Topbar({
  title,
  subtitle,
  userRole,
  userName = userRole === 'teacher' ? 'John Teacher' : 'Admin User',
  userAvatar,
}: TopbarProps) {
  return (
    <div className="ml-64 bg-white border-b border-gray-200 p-6 flex justify-between items-center sticky top-0 z-10 shadow-sm">
      {/* Title Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-600 text-sm mt-1">{subtitle}</p>}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Notification */}
        <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V2c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.46 3.36 5.82 5.92 5.82 9v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        </button>

        {/* Help */}
        <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4">
          <div className="text-right">
            <p className="font-semibold text-gray-900 text-sm">{userName}</p>
            <p className="text-xs text-gray-500 capitalize">{userRole}</p>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md ${
            userRole === 'teacher'
              ? 'bg-gradient-to-br from-blue-500 to-blue-700'
              : 'bg-gradient-to-br from-purple-500 to-purple-700'
          }`}>
            {userName.charAt(0)}
          </div>
        </div>
      </div>
    </div>
  )
}
