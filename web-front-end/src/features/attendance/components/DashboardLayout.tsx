'use client'

import SubNav from '@/components/SubNav'
import { getPortalMenu } from '@/components/portalMenus'
import Topbar from '../../../components/Topbar'

/** Sidebar removed, so there is no left offset any more.
 *  Kept as an export so other files that import it don't break. */
export const SIDEBAR_WIDTH_CLASS = ''

type DashboardRole = 'teacher' | 'admin' | 'super-admin'

const MENU_ROLE = {
  teacher: 'teacher',
  admin: 'school-admin',
  'super-admin': 'admin',
} as const

interface DashboardLayoutProps {
  userRole: DashboardRole
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
      <div className="flex min-h-screen flex-col">
        <Topbar
          userRole={MENU_ROLE[userRole]}
          userName={userName}
          searchValue={searchValue}
          onSearch={onSearch}
          searchPlaceholder={searchPlaceholder}
          searchClassName={searchClassName}
        />

        <SubNav items={getPortalMenu(MENU_ROLE[userRole])} />

        <div className="flex flex-1 flex-col">{children}</div>

        {footer}
      </div>
    </div>
  )
}