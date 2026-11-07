'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getNotifications, markNotificationRead } from '../services/notificationService'
import type { Notification } from '../types/notification'

type NotificationContextValue = {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(
    () => typeof window !== 'undefined' && Boolean(localStorage.getItem('accessToken')),
  )
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getNotifications()
      setNotifications(result.notifications)
      setUnreadCount(result.unreadCount)
      setError(null)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load notifications.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      queueMicrotask(() => void refresh())
    }
  }, [refresh])

  const markAsRead = useCallback(async (id: string) => {
    const notification = notifications.find((item) => item.id === id)
    if (!notification || notification.readAt) return

    await markNotificationRead(id)
    const readAt = new Date().toISOString()
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, readAt } : item)),
    )
    setUnreadCount((current) => Math.max(0, current - 1))
  }, [notifications])

  const value = useMemo(
    () => ({ notifications, unreadCount, isLoading, error, refresh, markAsRead }),
    [notifications, unreadCount, isLoading, error, refresh, markAsRead],
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotifications must be used inside NotificationProvider')
  return context
}
