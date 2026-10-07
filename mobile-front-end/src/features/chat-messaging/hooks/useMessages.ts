import { useEffect, useState, useCallback } from 'react';
import { Message } from '../types/messaging.types';
import { fetchMessages, sendMessage } from '../services/messagingApi';

export function useMessages(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages(conversationId)
      .then(setMessages)
      .finally(() => setLoading(false));
  }, [conversationId]);

  const send = useCallback(
    async (content: string) => {
      const newMessage = await sendMessage(conversationId, content);
      setMessages((prev) => [...prev, newMessage]);
    },
    [conversationId]
  );

  return { messages, loading, send };
}