import { Conversation, Message } from '../types/messaging.types';

// TEMPORARY mock data — replace with real API calls once messaging-service backend exists
const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participantName: 'Mr. Perera',
    participantRole: 'Maths',
    lastMessage: 'Please check the homework...',
    lastMessageTime: '10:00 AM',
    unreadCount: 1,
  },
  {
    id: 'conv-2',
    participantName: 'Sujatha Vidyalaya',
    participantRole: '',
    lastMessage: 'Please check the homework...',
    lastMessageTime: '10:00 AM',
    unreadCount: 1,
  },
];

const mockMessages: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: 'parent-1',
      senderName: 'You',
      isOwnMessage: true,
      content:
        'Hello teacher, about the project for next Friday, does it need to be strictly made of recycled materials or can we use any craft supplies?',
      timestamp: '2026-08-17T14:45:00Z',
      status: 'read',
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      senderId: 'teacher-1',
      senderName: 'Mrs. Silva',
      isOwnMessage: false,
      content:
        'Yes, you can use any materials. The "Green Project" title was just to emphasize sustainability, but I want the children to focus on structural creativity above all!',
      timestamp: '2026-08-17T14:52:00Z',
      status: 'delivered',
    },
  ],
};

// simulate network delay so your loading states actually get tested
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function fetchConversations(): Promise<Conversation[]> {
  await delay(400);
  return mockConversations;
}

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  await delay(400);
  return mockMessages[conversationId] ?? [];
}

export async function sendMessage(
  conversationId: string,
  content: string
): Promise<Message> {
  await delay(200);
  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    conversationId,
    senderId: 'parent-1',
    senderName: 'You',
    isOwnMessage: true,
    content,
    timestamp: new Date().toISOString(),
    status: 'sent',
  };
  mockMessages[conversationId] = [...(mockMessages[conversationId] ?? []), newMessage];
  return newMessage;
}