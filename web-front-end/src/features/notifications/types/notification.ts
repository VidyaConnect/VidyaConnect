export type Notification = {
  id: string
  title: string
  message: string
  type: string
  sourceId: string | null
  readAt: string | null
  createdAt: string
}

export type NotificationResponse = {
  notifications: Notification[]
  unreadCount: number
}
