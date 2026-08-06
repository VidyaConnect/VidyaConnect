'use client'

import SearchBar from './SearchBar'
import { NotificationIcon } from './Icons'

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

export default function Topbar({
  userRole,
  userName = userRole === 'teacher' ? 'Mrs. Thompson' : userRole === 'super-admin' ? 'Super Admin' : 'Admin User',
  searchValue = '',
  onSearch,
  searchPlaceholder = 'Search student...',
  searchClassName = '',
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 ml-56 flex h-16 items-center justify-between border-b border-[#cfd4dd] bg-white px-6 shadow-[0_1px_3px_rgba(15,23,42,0.08)]">
      <SearchBar
        value={searchValue}
        onSearch={onSearch ?? (() => {})}
        placeholder={searchPlaceholder}
        className={searchClassName}
      />

      <div className="flex items-center gap-4">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-md text-[#2b3038] transition-colors hover:bg-[#f1f4f8]"
          aria-label="Notifications"
        >
          <NotificationIcon size={20} />
        </button>

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
