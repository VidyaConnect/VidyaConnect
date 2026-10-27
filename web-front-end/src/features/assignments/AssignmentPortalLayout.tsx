'use client'

import Topbar from '@/components/Topbar'
import SubNav from '@/components/SubNav'
import { teacherMenu } from '@/components/portalMenus'
import { useAuth } from '@/features/auth/hooks/userAuth'

export default function AssignmentPortalLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-[#f7f8fa] font-sans text-[#25272c]">
      <header className="sticky top-0 z-30">
        <Topbar
          userRole="teacher"
          userName={user?.fullName}
          searchPlaceholder="Search students, classes, or records..."
        />
        <SubNav items={teacherMenu} />
      </header>
      {children}
    </div>
  )
}
