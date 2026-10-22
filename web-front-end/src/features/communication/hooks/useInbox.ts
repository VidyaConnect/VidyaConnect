import { useCallback, useEffect, useState } from "react";
import { communicationService } from "../services/communicationService";
import { ConversationSummary } from "../types/communication";

export function useInbox(classId: string) {
  const [chats, setChats] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setChats(await communicationService.getInbox(classId));
    } catch {
      setError("Could not load chats.");
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    load();
    // Refresh when the tab regains focus, so new messages show up.
    const onFocus = () => void load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  const totalUnread = chats.reduce((sum, c) => sum + c.unreadCount, 0);

  return { chats, loading, error, reload: load, totalUnread };
}