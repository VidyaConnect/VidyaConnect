'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SearchBar from './SearchBar'
import { NotificationIcon } from './Icons'
import { useNotifications } from '@/context/NotificationContext'

interface TopbarProps {
  title?: string
  subtitle?: string
  userRole: 'teacher' | 'admin' | 'super-admin'
  userName?: string
  userAvatar?: string
  searchValue?: string
  onSearch?: (term: string) => void
  searchPlaceholder?: string
  searchClassName?: string
}

function notificationRoute(userRole: TopbarProps['userRole']) {
  if (userRole === 'teacher') return '/announcements/teacher-feed'
  if (userRole === 'super-admin') return '/announcements/super-admin-view'
  return '/announcements'
}

function formatNotificationDate(dateString: string) {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return 'Recently'

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export default function Topbar({
  userRole,
  userName = userRole === 'teacher' ? 'Mrs. Thompson' : userRole === 'super-admin' ? 'Super Admin' : 'Admin User',
  searchValue = '',
  onSearch,
  searchPlaceholder = 'Search student...',
  searchClassName = '',
}: TopbarProps) {
  const router = useRouter()
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const {
    announcements,
    unreadCount,
    isLoading: isNotificationsLoading,
    markAsRead,
    isRead,
    markAllAsRead,
  } = useNotifications()

  const recentAnnouncements = announcements.slice(0, 5)

  function openAnnouncement(id: string) {
    markAsRead(id)
    setIsNotificationsOpen(false)
    router.push(notificationRoute(userRole))
  }

  return (
    <header className="sticky top-0 z-20 ml-56 flex h-16 items-center justify-between border-b border-[#cfd4dd] bg-white px-6 shadow-[0_1px_3px_rgba(15,23,42,0.08)]">
      <SearchBar
        value={searchValue}
        onSearch={onSearch ?? (() => {})}
        placeholder={searchPlaceholder}
        className={searchClassName}
      />

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationsOpen((open) => !open)}
            className="relative flex h-9 w-9 items-center justify-center rounded-md text-[#2b3038] transition-colors hover:bg-[#f1f4f8]"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
            aria-expanded={isNotificationsOpen}
          >
            <NotificationIcon size={20} />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-[#e5484d] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white shadow-sm">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_-20px_rgba(15,23,42,0.55)]">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">Notifications</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {unreadCount ? `${unreadCount} unread announcement${unreadCount === 1 ? '' : 's'}` : 'You are all caught up'}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {isNotificationsLoading && announcements.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-slate-400">Loading notifications...</div>
              ) : recentAnnouncements.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-slate-400">No announcements yet.</div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {recentAnnouncements.map((announcement) => {

                    const isUnread = !isRead(announcement.id)


                    return (
                      <button
                        key={announcement.id}
                        type="button"
                        onClick={() => openAnnouncement(announcement.id)}
                        className="flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50"
                      >
                        <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${isUnread ? 'bg-blue-500' : 'bg-slate-200'}`} />
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-bold text-slate-800">{announcement.title}</span>
                          <span className="mt-1 block truncate text-[11px] text-slate-500">{announcement.content}</span>
                          <span className="mt-1 block text-[10px] text-slate-400">{formatNotificationDate(announcement.publishDate)}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsNotificationsOpen(false)
                  router.push(notificationRoute(userRole))
                }}
                className="w-full bg-slate-50 px-4 py-3 text-center text-xs font-bold text-slate-700 transition hover:bg-slate-100"
              >
                View announcements
              </button>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-[#cfd4dd]" />

        <div className="flex items-center gap-3">
          <div className="h-9 w-9 overflow-hidden rounded-full bg-[linear-gradient(135deg,#d9e5f7,#f4d8c8)] shadow-sm">
            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#07356b]">
              {userName.charAt(0)}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold leading-tight text-[#242629]">{userName}</p>
            <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wide text-[#4b4f58]">
              {userRole === 'teacher' ? 'TEACHER' : userRole === 'super-admin' ? 'SUPER ADMIN' : 'ADMIN'}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}