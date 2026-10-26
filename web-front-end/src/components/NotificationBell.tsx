'use client'

import { useState } from 'react'
import { NotificationIcon } from './Icons'
import NotificationDropdown from './NotificationDropdown'
import { useNotifications } from '@/features/notifications/context/NotificationContext'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { unreadCount, refresh } = useNotifications()

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((current) => !current)
          if (!open) void refresh()
        }}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#2d2f31] transition-colors hover:bg-[#f1f4f8]"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
        title="Notifications"
      >
        <NotificationIcon size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      {open && <NotificationDropdown onClose={() => setOpen(false)} />}
    </div>
  )
}
