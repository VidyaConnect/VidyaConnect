import { useCallback, useEffect, useRef, useState } from "react";
import { communicationService } from "../services/communicationService";
import { Attachment, ChatMessage, ConversationRef } from "../types/communication";
import { formatFileSize } from "../utils/format";

const TEACHER_NAME = "Mrs. Silva"; // TODO: read from your auth context

export function useConversation({ kind, classId, parentId }: ConversationRef) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pending = useRef(new Map<string, { body: string; attachments: Attachment[] }>());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setMessages(await communicationService.getMessages({ kind, classId, parentId }));
    } catch {
      setError("Could not load this conversation.");
    } finally {
      setLoading(false);
    }
  }, [kind, classId, parentId]);

  useEffect(() => {
    load();
  }, [load]);

  const deliver = useCallback(
    async (localId: string) => {
      const payload = pending.current.get(localId);
      if (!payload) return;
      try {
        // TODO (real API): upload files to the file service first, then send their ids.
        const saved = await communicationService.sendMessage(
          { kind, classId, parentId },
          payload.body,
          payload.attachments
        );
        pending.current.delete(localId);
        setMessages((prev) => prev.map((m) => (m.id === localId ? saved : m)));
      } catch {
        setMessages((prev) =>
          prev.map((m) => (m.id === localId ? { ...m, status: "failed" } : m))
        );
      }
    },
    [kind, classId, parentId]
  );

  const send = useCallback(
    (text: string, files: File[]) => {
      const body = text.trim();
      if (!body && files.length === 0) return;

      const attachments: Attachment[] = files.map((f, i) => ({
        id: `att-${Date.now()}-${i}`,
        name: f.name,
        sizeLabel: formatFileSize(f.size)
      }));
      const localId = `local-${Date.now()}`;
      pending.current.set(localId, { body, attachments });

      setMessages((prev) => [
        ...prev,
        {
          id: localId,
          senderRole: "teacher",
          senderName: TEACHER_NAME,
          body,
          sentAt: new Date().toISOString(),
          status: "sending",
          attachments
        }
      ]);
      void deliver(localId);
    },
    [deliver]
  );

  const retry = useCallback(
    (messageId: string) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, status: "sending" } : m))
      );
      void deliver(messageId);
    },
    [deliver]
  );

  return { messages, loading, error, reload: load, send, retry };
}