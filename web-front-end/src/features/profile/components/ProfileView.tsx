'use client'

import type { UserProfile } from '../types/profile.types'

interface ProfileViewProps {
  profile: UserProfile
  onEditProfile?: () => void
  onChangePassword?: () => void
}

export default function ProfileView({ profile, onEditProfile, onChangePassword }: ProfileViewProps) {
  return (
    <div className="flex-1 px-8 py-6">
      <h1 className="text-2xl font-bold text-[#1a1d21]">My Profile</h1>
      <p className="mt-1 text-sm text-[#6b7280]">
        View and manage your personal information and account settings.
      </p>

      {/* Header card */}
      <div className="mt-6 flex items-center justify-between rounded-xl bg-[#07356b] px-8 py-6 text-white shadow-sm">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d9e5f7] text-2xl font-bold text-[#07356b]">
            {profile.avatarInitial}
          </div>
          <div>
            <h2 className="text-xl font-bold">{profile.fullName}</h2>
            <p className="text-sm text-[#cfe0f7]">{profile.roleTitle}</p>
            <p className="mt-1 text-xs text-[#b9cbe2]">{profile.summaryLine}</p>
          </div>
        </div>
        <button
          onClick={onEditProfile}
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#07356b] transition-colors hover:bg-[#e8eef7]"
        >
          Edit Profile
        </button>
      </div>

      {/* Quick stats row */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        {profile.quickStats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[#e5e7eb] bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8f98]">{stat.label}</p>
            {stat.isStatus ? (
              <span className="mt-1 inline-block rounded-full bg-[#e3f8ef] px-3 py-1 text-xs font-bold text-[#16a34a]">
                {stat.value}
              </span>
            ) : (
              <p className="mt-1 text-sm font-bold text-[#1a1d21]">{stat.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Info sections */}
      <div className="mt-6 space-y-4">
        {profile.sections.map((section) => (
          <div key={section.title} className="rounded-xl border border-[#e5e7eb] bg-white px-6 py-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#1a1d21]">{section.title}</h3>
            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-4">
              {section.fields.map((field) => (
                <div key={field.label}>
                  <p className="text-xs font-semibold text-[#8a8f98]">{field.label}</p>
                  <p className="mt-1 text-sm font-semibold text-[#1a1d21]">{field.value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Security settings */}
        <div className="rounded-xl border border-[#e5e7eb] bg-white px-6 py-5 shadow-sm">
          <h3 className="text-sm font-bold text-[#1a1d21]">Security Settings</h3>
          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p className="text-xs font-semibold text-[#8a8f98]">Password</p>
              <div className="mt-1 flex items-center gap-3">
                <p className="text-sm font-semibold text-[#1a1d21]">{profile.security.passwordMasked}</p>
                <button
                  onClick={onChangePassword}
                  className="rounded-md border border-[#d1d5db] px-3 py-1 text-xs font-semibold text-[#374151] hover:bg-[#f9fafb]"
                >
                  Change Password
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#8a8f98]">Two-Factor Authentication</p>
              <p className="mt-1 text-sm font-semibold text-[#16a34a]">
                {profile.security.twoFactorEnabled ? 'Enabled ✓' : 'Disabled'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-[#9ca3af]">Profile last updated on {profile.lastUpdated}</p>
    </div>
  )
}