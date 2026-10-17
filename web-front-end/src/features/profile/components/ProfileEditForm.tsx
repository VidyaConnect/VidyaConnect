'use client'

import { useEffect, useState } from 'react'
import type { UserProfile } from '../types/profile.types'

interface ProfileEditFormProps {
  profile: UserProfile
  onSave: (updatedFields: Record<string, string>) => void
  onCancel: () => void
  saving?: boolean
}

// Maximum characters allowed per field
const MAX_LENGTH: Record<string, number> = {
  'Full Name': 40,
  'Email Address': 100,
  'Phone Number': 20,
}

// Returns an error message, or an empty string if the value is valid
function validateField(label: string, rawValue: string): string {
  const value = rawValue.trim()

  if (label === 'Full Name') {
    if (!value) return 'Full name is required.'
    if (value.length < 2) return 'Full name must be at least 2 characters.'
  }

  if (label === 'Email Address') {
    if (!value) return 'Email address is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.'
  }

  if (label === 'Phone Number') {
    if (!value) return 'Phone number is required.'
    if (!/^[+0-9\s()-]+$/.test(value)) {
      return 'Phone number can only contain digits, spaces, +, - and brackets.'
    }
    const digitCount = value.replace(/\D/g, '').length
    if (digitCount < 9 || digitCount > 15) return 'Phone number must have 9 to 15 digits.'
  }

  return ''
}

export default function ProfileEditForm({ profile, onSave, onCancel, saving = false }: ProfileEditFormProps) {
  const editableFields = profile.sections
    .flatMap((section) => section.fields)
    .filter((field) => field.editable)

  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(editableFields.map((field) => [field.label, field.value]))
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Close the modal when the Esc key is pressed (unless a save is in progress)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !saving) onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel, saving])

  const handleChange = (label: string, newValue: string) => {
    setValues((prev) => ({ ...prev, [label]: newValue }))
    // Clear that field's error as soon as the user starts fixing it
    if (errors[label]) {
      setErrors((prev) => ({ ...prev, [label]: '' }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (saving) return

    const newErrors: Record<string, string> = {}
    const cleaned: Record<string, string> = {}

    editableFields.forEach((field) => {
      const trimmed = (values[field.label] ?? '').trim()
      cleaned[field.label] = trimmed
      const message = validateField(field.label, trimmed)
      if (message) newErrors[field.label] = message
    })

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    onSave(cleaned)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-[#1a1d21]">Edit Profile</h2>
        <p className="mt-1 text-sm text-[#6b7280]">Update your personal information below.</p>

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          {editableFields.map((field) => (
            <div key={field.label}>
              <label className="text-xs font-semibold text-[#8a8f98]">{field.label}</label>
              <input
                type="text"
                value={values[field.label]}
                maxLength={MAX_LENGTH[field.label]}
                onChange={(e) => handleChange(field.label, e.target.value)}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-[#1a1d21] focus:outline-none ${
                  errors[field.label]
                    ? 'border-[#dc2626] focus:border-[#dc2626]'
                    : 'border-[#d1d5db] focus:border-[#07356b]'
                }`}
              />
              {errors[field.label] && (
                <p className="mt-1 text-xs font-semibold text-[#dc2626]">{errors[field.label]}</p>
              )}
            </div>
          ))}

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
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}