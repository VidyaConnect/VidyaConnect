'use client'

import { useState } from 'react'
import SearchBar from './SearchBar'
import { NotificationIcon, SettingsIcon, HelpIcon } from './Icons'

interface TopbarProps {
  userRole: 'teacher' | 'admin' | 'super-admin'
  userName?: string
  searchValue?: string
  onSearch?: (term: string) => void
  searchPlaceholder?: string
  searchClassName?: string
}

export default function Topbar({
  userRole,
  userName,
  searchValue = '',
  onSearch,
  searchPlaceholder = 'Search...',
  searchClassName = 'max-w-[420px]',
}: TopbarProps) {
  const [activeTab, setActiveTab] = useState('dashboard')

  // Names from Figma UI
  const displayUserName = userName ?? (
    userRole === 'teacher'
      ? 'Ms. Sarah Jenkins'
      : userRole === 'admin'
      ? 'Principal Henderson'
      : 'Super Admin'
  )

  const displayUserTitle = userRole === 'teacher'
    ? 'Lead Educator'
    : userRole === 'admin'
    ? 'Principal'
    : 'Platform Controller'

  return (
    <header className="sticky top-0 z-20 flex h-[76px] shrink-0 items-center justify-between border-b border-[#cfd4dd] bg-white px-8 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
      
      {/* Left side: Search or Admin Nav tabs */}
      <div className="flex min-w-0 flex-1 items-center">
        {userRole === 'admin' && (
          <div className="flex items-center gap-8">
            {['Dashboard', 'Schools', 'Subscriptions', 'Reports'].map((tab) => {
              const tabId = tab.toLowerCase()
              const active = activeTab === tabId
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tabId)}
                  className={`relative text-base font-extrabold transition-colors py-6 ${
                    active ? 'text-[#007c6d]' : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  {tab}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#007c6d] rounded-t" />
                  )}
                </button>
              )
            })}
          </div>
        )}

        {userRole !== 'admin' && (
          <SearchBar
            value={searchValue}
            onSearch={onSearch ?? (() => {})}
            placeholder={searchPlaceholder}
            className={searchClassName}
          />
        )}
      </div>

      {/* Right side: Search (for admin) and Profile/Icons */}
      <div className="flex shrink-0 items-center gap-6">
        {userRole === 'admin' && (
          <SearchBar
            value={searchValue}
            onSearch={onSearch ?? (() => {})}
            placeholder="Search data..."
            className="max-w-[280px]"
          />
        )}

        {/* Action Icons */}
        <div className="flex items-center gap-3">
          {/* Notification Icon with Badge */}
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#475569] transition-colors hover:bg-slate-100">
            <NotificationIcon size={20} />
            <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ef4444] text-[10px] font-bold text-white shadow-sm">
              5
            </span>
          </button>

          {/* Help/Settings Icon based on role */}
          {userRole === 'teacher' ? (
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#475569] transition-colors hover:bg-slate-100">
              <HelpIcon size={20} />
            </button>
          ) : (
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#475569] transition-colors hover:bg-slate-100">
              <SettingsIcon size={20} />
            </button>
          )}
        </div>

        <div className="h-8 w-px bg-[#cfd4dd]" />

        {/* User profile details */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e2e8f0,#cbd5e1)] font-extrabold text-[#073b78] shadow-sm select-none border border-slate-200">
            {displayUserName.charAt(0)}
          </div>
          <div className="text-left">
            <p className="text-sm font-black leading-tight text-[#0f172a]">{displayUserName}</p>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] mt-0.5">
              {displayUserTitle}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
