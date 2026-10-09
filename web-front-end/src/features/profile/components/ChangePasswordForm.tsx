'use client'

import { useEffect, useState } from 'react'

interface ChangePasswordFormProps {
  onSave: (payload: { currentPassword: string; newPassword: string }) => void
  onCancel: () => void
  saving?: boolean
}

export default function ChangePasswordForm({ onSave, onCancel, saving = false }: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  
  // Close the modal when the Esc key is pressed (unless a save is in progress)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !saving) onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel, saving])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }
    if (newPassword.trim().length < 8) {
      setError('New password must be at least 8 characters (spaces alone do not count).')
      return
    }
    if (newPassword === currentPassword) {
      setError('New password must be different from your current password.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.')
      return
    }

    onSave({ currentPassword, newPassword })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-[#1a1d21]">Change Password</h2>
        <p className="mt-1 text-sm text-[#6b7280]">Enter your current password and choose a new one.</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#8a8f98]">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-sm text-[#1a1d21] focus:border-[#07356b] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#8a8f98]">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-sm text-[#1a1d21] focus:border-[#07356b] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#8a8f98]">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-sm text-[#1a1d21] focus:border-[#07356b] focus:outline-none"
            />
          </div>

          {error && <p className="text-sm font-semibold text-[#dc2626]">{error}</p>}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="rounded-lg border border-[#d1d5db] px-4 py-2 text-sm font-semibold text-[#374151] hover:bg-[#f9fafb]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#07356b] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0a4680] disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}