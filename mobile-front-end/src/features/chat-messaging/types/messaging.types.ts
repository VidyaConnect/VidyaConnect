export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  isOwnMessage: boolean; // true if the logged-in user sent it
  content: string;
  timestamp: string; // ISO string, e.g. "2026-08-17T14:45:00Z"
  status: MessageStatus;
}

export interface Conversation {
  id: string;
  participantName: string;   // e.g. "Mrs. Silva"
  participantRole: string;   // e.g. "Class Teacher 8-A"
  participantAvatarUrl?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}