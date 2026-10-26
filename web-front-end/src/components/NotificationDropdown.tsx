'use client'

import { useRouter } from 'next/navigation'
import { useNotifications } from '@/features/notifications/context/NotificationContext'

function formatTime(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

export default function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const { notifications, isLoading, error, markAsRead } = useNotifications()

  return (
    <div className="absolute right-0 top-12 z-50 w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-[#d1d2e0] bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3">
        <h2 className="font-bold text-[#003b78]">Notifications</h2>
        <button onClick={onClose} className="text-xs text-gray-500 hover:text-gray-900">Close</button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {isLoading && <p className="p-5 text-sm text-gray-500">Loading notifications...</p>}
        {!isLoading && error && <p className="p-5 text-sm text-red-600">{error}</p>}
        {!isLoading && !error && notifications.length === 0 && (
          <p className="p-5 text-sm text-gray-500">You have no notifications.</p>
        )}
        {!isLoading && !error && notifications.map((notification) => (
          <button
            key={notification.id}
            className={`block w-full border-b border-[#f0f1f4] px-4 py-3 text-left hover:bg-[#f7f9fa] ${notification.readAt ? '' : 'bg-blue-50'}`}
            onClick={async () => {
              await markAsRead(notification.id)
              if (notification.sourceId) {
                router.push(`/announcements/${notification.type === 'SYSTEM' ? 'admin' : 'school-admin'}`)
                onClose()
              }
            }}
          >
            <div className="flex items-start gap-2">
              {!notification.readAt && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00a896]" />}
              <span className="min-w-0">
                <span className="block font-semibold text-[#242629]">{notification.title}</span>
                <span className="mt-1 block text-sm text-gray-600">{notification.message}</span>
                <span className="mt-1 block text-xs text-gray-400">{formatTime(notification.createdAt)}</span>
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
