import { useCallback, useEffect, useState } from "react";
import { communicationApi } from "../services/communicationApi";
import { Attachment, ChatMessage, ChatThreadInfo, PickedFile } from "../types/communication";
import { formatFileSize } from "../utils/buildChatItems";

export function useChatThread(threadId: string) {
  const [thread, setThread] = useState<ChatThreadInfo | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [info, list] = await Promise.all([
        communicationApi.getThread(threadId),
        communicationApi.getMessages(threadId)
      ]);
      setThread(info);
      setMessages(list);
    } catch {
      setError("Could not load this conversation.");
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    load();
  }, [load]);

  const deliver = useCallback(
    async (local: ChatMessage) => {
      try {
        // TODO (real API): upload each file to the file service first, then send the file ids.
        const saved = await communicationApi.sendMessage(
          threadId,
          local.body,
          local.attachments ?? []
        );
        setMessages((prev) => prev.map((m) => (m.id === local.id ? saved : m)));
      } catch {
        setMessages((prev) =>
          prev.map((m) => (m.id === local.id ? { ...m, status: "failed" } : m))
        );
      }
    },
    [threadId]
  );

  const sendMessage = useCallback(
    async (body: string, files: PickedFile[] = []) => {
      const text = body.trim();
      if (!text && files.length === 0) return;

      const attachments: Attachment[] = files.map((f, i) => ({
        id: `att-${Date.now()}-${i}`,
        name: f.name,
        sizeLabel: formatFileSize(f.size),
        uri: f.uri,
        mimeType: f.mimeType
      }));

      const local: ChatMessage = {
        id: `local-${Date.now()}`,
        threadId,
        senderRole: "parent",
        senderName: "You",
        body: text,
        sentAt: new Date().toISOString(),
        status: "sending",
        attachments
      };
      setMessages((prev) => [...prev, local]);
      await deliver(local);
    },
    [threadId, deliver]
  );

  const retryMessage = useCallback(
    async (messageId: string) => {
      const target = messages.find((m) => m.id === messageId);
      if (!target) return;
      const retrying: ChatMessage = { ...target, status: "sending" };
      setMessages((prev) => prev.map((m) => (m.id === messageId ? retrying : m)));
      await deliver(retrying);
    },
    [messages, deliver]
  );

  return { thread, messages, loading, error, reload: load, sendMessage, retryMessage };
}