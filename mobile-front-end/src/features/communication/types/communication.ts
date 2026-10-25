export type SenderRole = "teacher" | "parent";

export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

/** A file the parent picked, before it is uploaded. */
export interface PickedFile {
  uri: string;
  name: string;
  size: number;
  mimeType?: string;
}

/** A file attached to a message. */
export interface Attachment {
  id: string;
  name: string;
  sizeLabel: string;
  uri?: string;
  mimeType?: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderRole: SenderRole;
  senderName: string;
  body: string;
  /** ISO timestamp. The server is the source of truth (auditable). */
  sentAt: string;
  status: MessageStatus;
  attachments?: Attachment[];
  /** Optional system note shown under the bubble, e.g. "Teacher is unavailable..." */
  deliveryNote?: string;
}

export interface ChatThreadInfo {
  id: string;
  teacherName: string;
  className: string;
  availabilityLabel: string;
  isTeacherAvailable: boolean;
}

export type ChatListItem =
  | { type: "date"; id: string; label: string }
  | { type: "message"; id: string; message: ChatMessage };