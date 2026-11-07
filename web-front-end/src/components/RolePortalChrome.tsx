'use client'

import { useState } from 'react'
import Topbar from './Topbar'
import SubNav from './SubNav'
import { getPortalMenu } from './portalMenus'

export default function RolePortalChrome({
  userRole,
}: {
  userRole: 'teacher' | 'admin' | 'school-admin'
}) {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <header className="sticky top-0 z-30">
      <Topbar
        userRole={userRole}
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        searchPlaceholder="Search..."
      />
      <SubNav items={getPortalMenu(userRole)} />
    </header>
  )
}