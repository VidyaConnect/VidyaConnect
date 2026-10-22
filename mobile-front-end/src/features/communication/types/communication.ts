export type SenderRole = "teacher" | "parent";

export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export interface ChatMessage {
  id: string;
  threadId: string;
  senderRole: SenderRole;
  senderName: string;
  body: string;
  /** ISO timestamp. The server is the source of truth (auditable). */
  sentAt: string;
  status: MessageStatus;
  /** Optional system note shown under the bubble, e.g. "Teacher is unavailable..." */
  deliveryNote?: string;
}

export interface ChatThreadInfo {
  id: string;
  teacherName: string;
  className: string;
  availabilityLabel: string; // e.g. "Available 4pm - 6pm"
  isTeacherAvailable: boolean;
}

export type ChatListItem =
  | { type: "date"; id: string; label: string }
  | { type: "message"; id: string; message: ChatMessage };