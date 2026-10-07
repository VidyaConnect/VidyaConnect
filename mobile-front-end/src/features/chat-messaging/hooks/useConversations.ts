import { useEffect, useState } from 'react';
import { Conversation } from '../types/messaging.types';
import { fetchConversations } from '../services/messagingApi';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations()
      .then(setConversations)
      .finally(() => setLoading(false));
  }, []);

  return { conversations, loading };
}