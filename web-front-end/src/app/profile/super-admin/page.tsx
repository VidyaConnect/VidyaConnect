'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import ProfileView from '@/features/profile/components/ProfileView'
import { getMyProfile } from '@/features/profile/services/profileService'
import type { UserProfile } from '@/features/profile/types/profile.types'

export default function SuperAdminProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyProfile('super-admin')
      .then(setProfile)
      .finally(() => setLoading(false))
  }, [])

  const handleNavigate = (page: string) => {
    router.push(`/${page}`)
  }

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8fa]">
        <p className="text-sm text-[#6b7280]">Loading profile...</p>
      </div>
    )
  }

  return (
    <DashboardLayout
      userRole="super-admin"
      currentPage="admin-management"
      onNavigate={handleNavigate}
      userName={profile.fullName}
      searchPlaceholder="Search student..."
    >
      <ProfileView profile={profile} />
    </DashboardLayout>
  )
}