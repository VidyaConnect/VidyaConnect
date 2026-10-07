'use client'

import Topbar from '@/components/Topbar'
import SubNav from '@/components/SubNav'
import { getPortalMenu } from '@/components/portalMenus'

interface RolePortalChromeProps {
  userRole: 'teacher' | 'admin' | 'school-admin'
}

export default function RolePortalChrome({ userRole }: RolePortalChromeProps) {
  return (
    <header className="sticky top-0 z-30">
      <Topbar userRole={userRole} />
      <SubNav items={getPortalMenu(userRole)} />
    </header>
  )
}