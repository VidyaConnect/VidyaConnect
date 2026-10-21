'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/features/attendance/components/DashboardLayout'
import ProfileView from '@/features/profile/components/ProfileView'
import ProfileEditForm from '@/features/profile/components/ProfileEditForm'
import ChangePasswordForm from '@/features/profile/components/ChangePasswordForm'
import { getMyProfile, updateMyProfile, changeMyPassword } from '@/features/profile/services/profileService'
import type { UserProfile } from '@/features/profile/types/profile.types'

export default function SchoolAdminProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getMyProfile('admin')
      .then(setProfile)
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load profile.'))
      .finally(() => setLoading(false))
  }, [])

  const handleNavigate = (page: string) => {
    router.push(`/${page}`)
  }

  const handleSaveProfile = async (updatedFields: Record<string, string>) => {
    setSaving(true)
    try {
      const updated = await updateMyProfile('admin', updatedFields)
      setProfile({ ...updated })
      setIsEditing(false)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Could not save your changes.')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (payload: { currentPassword: string; newPassword: string }) => {
    setPasswordSaving(true)
    const result = await changeMyPassword('admin', payload)
    setPasswordSaving(false)
    if (result.success) setIsChangingPassword(false)
    alert(result.message)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8fa]">
        <p className="text-sm text-[#6b7280]">Loading profile...</p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8fa]">
        <p className="text-sm font-semibold text-[#dc2626]">{error || 'Profile not available.'}</p>
      </div>
    )
  }

  return (
    <DashboardLayout
      userRole="admin"
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