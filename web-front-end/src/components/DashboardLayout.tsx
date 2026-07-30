'use client'

import Navbar from './Navbar'
import Topbar from './Topbar'

/** Must match Navbar aside width (`w-64` = 16rem) */
export const SIDEBAR_WIDTH_CLASS = 'ml-64'

interface DashboardLayoutProps {
  userRole: 'teacher' | 'admin' | 'super-admin'
  currentPage: string
  onNavigate: (page: string) => void
  searchValue?: string
  onSearch?: (term: string) => void
  searchPlaceholder?: string
  searchClassName?: string
  userName?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export default function DashboardLayout({
  userRole,
  currentPage,
  onNavigate,
  searchValue,
  onSearch,
  searchPlaceholder,
  searchClassName,
  userName,
  children,
  footer,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f8fa] font-sans text-[#25272c]">
      <Navbar userRole={userRole} currentPage={currentPage} onNavigate={onNavigate} />

      <div className={`${SIDEBAR_WIDTH_CLASS} flex min-h-screen flex-col`}>
        <Topbar
          userRole={userRole}
          userName={userName}
          searchValue={searchValue}
          onSearch={onSearch}
          searchPlaceholder={searchPlaceholder}
          searchClassName={searchClassName}
        />

        <div className="flex flex-1 flex-col">
          {children}
        </div>

        {footer}
      </div>
    </div>
  )
}
