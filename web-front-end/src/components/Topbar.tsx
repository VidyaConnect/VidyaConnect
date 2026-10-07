'use client'

import { useRouter } from 'next/navigation'
import SearchBar from './SearchBar'
import { NotificationIcon } from './Icons'
import { useAuth } from '@/features/auth/hooks/userAuth'

interface TopbarProps {
  title?: string
  subtitle?: string
  userRole: 'teacher' | 'school-admin' | 'admin'
  userName?: string
  userAvatar?: string
  searchValue?: string
  onSearch?: (term: string) => void
  searchPlaceholder?: string
  searchClassName?: string
}

const roleLabels: Record<TopbarProps['userRole'], string> = {
  'teacher': 'TEACHER',
  'school-admin': 'SCHOOL ADMIN',
  'admin': 'ADMIN',
}

const defaultNames: Record<TopbarProps['userRole'], string> = {
  'teacher': 'Mrs. Thompson',
  'school-admin': 'Admin User',
  'admin': 'Admin',
}

export default function Topbar({
  userRole,
  userName = defaultNames[userRole],
  searchValue = '',
  onSearch,
  searchPlaceholder = 'Search student...',
  searchClassName = '',
}: TopbarProps) {
  const router = useRouter()
  const { logout } = useAuth()

  function handleLogout() {
    logout()
    router.replace('/login')
  }

  return (
    <div className="relative flex h-[72px] items-center gap-6 border-b border-[#d1d2e0] bg-white px-8">
      <span className="shrink-0 text-2xl font-extrabold tracking-tight text-[#003b78]">
        VidyaConnect
      </span>

      <div className="min-w-0 flex-1 [&_input]:h-12 [&_input]:w-full [&_input]:rounded-full [&_input]:border [&_input]:border-[#6a6f73] [&_input]:bg-[#f7f9fa] [&_input]:pl-12 [&_input]:pr-4 [&_input]:text-sm">
        <SearchBar
          value={searchValue}
          onSearch={onSearch ?? (() => {})}
          placeholder={searchPlaceholder}
          className={searchClassName}
        />
      </div>

      <div className="flex shrink-0 items-center gap-4 whitespace-nowrap">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#2d2f31] transition-colors hover:bg-[#f1f4f8]"
          aria-label="Notifications"
        >
          <NotificationIcon size={20} />
        </button>

        <div className="h-8 w-px bg-[#cfd4dd]" />

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1c1d1f] text-sm font-bold text-white">
            {userName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold leading-tight text-[#242629]">{userName}</p>
            <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wide text-[#6a6f73]">
              {roleLabels[userRole]}
            </p>
          </div>
        </div>

        <div className="h-8 w-px bg-[#cfd4dd]" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-semibold text-[#2d2f31] transition-colors hover:text-[#c2161c]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Log Out
        </button>
      </div>
    </div>
  )
}