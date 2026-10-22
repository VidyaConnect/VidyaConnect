export type SenderRole = "teacher" | "parent";
export type MessageStatus = "sending" | "sent" | "failed";

export interface Attachment {
  id: string;
  name: string;
  sizeLabel: string;
}

export interface ChatMessage {
  id: string;
  senderRole: SenderRole;
  senderName: string;
  /** e.g. "Parent of Kavindu Perera" (shown in the community only) */
  senderSubtitle?: string;
  body: string;
  /** ISO timestamp. The server is the source of truth (auditable). */
  sentAt: string;
  status: MessageStatus;
  attachments?: Attachment[];
  /** Community messages only: how many parents received / read it. */
  recipientCount?: number;
  readCount?: number;
}

export interface ClassCommunity {
  classId: string;
  name: string; // "Grade 8A"
  title: string; // "Grade 8A Community"
  teacherName: string;
  memberCount: number;
}

export interface ClassMember {
  id: string; // parent id
  parentName: string;
  studentName: string;
  relation: "Mother" | "Father" | "Guardian";
}

export interface ConversationRef {
  kind: "community" | "direct";
  classId: string;
  parentId?: string;
}

export type ChatListItem =
  | { type: "date"; id: string; label: string }
  | { type: "message"; id: string; message: ChatMessage };

export interface ConversationSummary {
  parentId: string;
  parentName: string;
  studentName: string;
  relation: ClassMember["relation"];
  lastMessage: string;
  lastMessageAt: string; // ISO
  unreadCount: number;
}