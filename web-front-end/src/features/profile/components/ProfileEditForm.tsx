'use client'

import { useState } from 'react'
import type { UserProfile } from '../types/profile.types'

interface ProfileEditFormProps {
  profile: UserProfile
  onSave: (updatedFields: Record<string, string>) => void
  onCancel: () => void
  saving?: boolean
}

export default function ProfileEditForm({ profile, onSave, onCancel, saving = false }: ProfileEditFormProps) {
  // Find every field across all sections that is marked editable,
  // and set up one piece of state per field, starting with its current value.
  const editableFields = profile.sections
    .flatMap((section) => section.fields)
    .filter((field) => field.editable)

  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(editableFields.map((field) => [field.label, field.value]))
  )

  const handleChange = (label: string, newValue: string) => {
    setValues((prev) => ({ ...prev, [label]: newValue }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(values)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-[#1a1d21]">Edit Profile</h2>
        <p className="mt-1 text-sm text-[#6b7280]">Update your personal information below.</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {editableFields.map((field) => (
            <div key={field.label}>
              <label className="text-xs font-semibold text-[#8a8f98]">{field.label}</label>
              <input
                type="text"
                value={values[field.label]}
                onChange={(e) => handleChange(field.label, e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-sm text-[#1a1d21] focus:border-[#07356b] focus:outline-none"
              />
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