'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import ProfileView from '@/features/profile/components/ProfileView'
import ProfileEditForm from '@/features/profile/components/ProfileEditForm'
import ChangePasswordForm from '@/features/profile/components/ChangePasswordForm'
import { getMyProfile, updateMyProfile, changeMyPassword } from '@/features/profile/services/profileService'
import type { UserProfile } from '@/features/profile/types/profile.types'

export default function TeacherProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)

  useEffect(() => {
    getMyProfile('teacher')
      .then(setProfile)
      .finally(() => setLoading(false))
  }, [])

  const handleNavigate = (page: string) => {
    router.push(`/${page}`)
  }

  const handleSaveProfile = async (updatedFields: Record<string, string>) => {
    setSaving(true)
    const updated = await updateMyProfile('teacher', updatedFields)
    setProfile({ ...updated })
    setSaving(false)
    setIsEditing(false)
  }

  const handleChangePassword = async (payload: { currentPassword: string; newPassword: string }) => {
    setPasswordSaving(true)
    const result = await changeMyPassword('teacher', payload)
    setPasswordSaving(false)
    setIsChangingPassword(false)
    alert(result.message)
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
      userRole="teacher"
      currentPage="settings"
      onNavigate={handleNavigate}
      userName={profile.fullName}
      searchPlaceholder="Search student..."
    >
      <ProfileView
        profile={profile}
        onEditProfile={() => setIsEditing(true)}
        onChangePassword={() => setIsChangingPassword(true)}
      />

      {isEditing && (
        <ProfileEditForm
          profile={profile}
          onSave={handleSaveProfile}
          onCancel={() => setIsEditing(false)}
          saving={saving}
        />
      )}

      {isChangingPassword && (
        <ChangePasswordForm
          onSave={handleChangePassword}
          onCancel={() => setIsChangingPassword(false)}
          saving={passwordSaving}
        />
      )}
    </DashboardLayout>
  )
}