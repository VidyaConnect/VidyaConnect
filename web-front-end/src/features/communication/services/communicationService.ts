import {
  Attachment,
  ChatMessage,
  ClassCommunity,
  ClassMember,
  ConversationRef,
  ConversationSummary
} from "../types/communication";
import {
  mockCommunity,
  mockCommunityMessages,
  mockDirectMessagesPerera,
  mockInboxSeed,
  mockMembers
} from "../data/mockCommunity";
/**
 * Set to false when the communication service (port 3009) is ready, then
 * implement each function with axios. The server must stamp id + sentAt and
 * store messages immutably (audit).
 * Type "#fail" in a message to test the failed / retry state.
 */
const USE_MOCK = true;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock inbox state, kept in memory so "recent first" and "read" work during a session.
const inboxState = mockInboxSeed.map((x) => ({ ...x }));

export const communicationService = {
  async getCommunity(classId: string): Promise<ClassCommunity> {
    if (USE_MOCK) {
      await wait(300);
      return { ...mockCommunity, classId, memberCount: mockMembers.length };
    }
    throw new Error("Not implemented: GET /communication/classes/:classId");
  },

    async getInbox(classId: string): Promise<ConversationSummary[]> {
    if (USE_MOCK) {
      await wait(300);
      return inboxState
        .map((i) => {
          const m = mockMembers.find((x) => x.id === i.parentId)!;
          return {
            parentId: i.parentId,
            parentName: m.parentName,
            studentName: m.studentName,
            relation: m.relation,
            lastMessage: i.lastMessage,
            lastMessageAt: i.lastMessageAt,
            unreadCount: i.unreadCount
          };
        })
        .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
    }
    throw new Error("Not implemented: GET /communication/classes/:classId/inbox");
  },

  async markRead(classId: string, parentId: string): Promise<void> {
    if (USE_MOCK) {
      const row = inboxState.find((i) => i.parentId === parentId);
      if (row) row.unreadCount = 0;
      return;
    }
    throw new Error("Not implemented: POST /communication/.../read");
  },

  async getMembers(classId: string): Promise<ClassMember[]> {
    if (USE_MOCK) {
      await wait(300);
      return mockMembers;
    }
    throw new Error("Not implemented: GET /communication/classes/:classId/members");
  },

  async getMember(classId: string, parentId: string): Promise<ClassMember> {
    if (USE_MOCK) {
      await wait(200);
      const found = mockMembers.find((m) => m.id === parentId);
      if (!found) throw new Error("Member not found");
      return found;
    }
    throw new Error("Not implemented: GET /communication/classes/:classId/members/:parentId");
  },

  async getMessages(ref: ConversationRef): Promise<ChatMessage[]> {
    if (USE_MOCK) {
      await wait(500);
      if (ref.kind === "community") return mockCommunityMessages;
      return ref.parentId === "p-perera" ? mockDirectMessagesPerera : [];
    }
    throw new Error("Not implemented: GET messages");
  },

    async sendMessage(
    ref: ConversationRef,
    body: string,
    attachments: Attachment[]
  ): Promise<ChatMessage> {
    if (USE_MOCK) {
      await wait(700);
      if (body.includes("#fail")) throw new Error("Simulated failure");

      if (ref.kind === "direct") {
        const preview = body || attachments[0]?.name || "Attachment";
        const row = inboxState.find((i) => i.parentId === ref.parentId);
        if (row) {
          row.lastMessage = `You: ${preview}`;
          row.lastMessageAt = new Date().toISOString();
        } else if (ref.parentId) {
          inboxState.push({
            parentId: ref.parentId,
            lastMessage: `You: ${preview}`,
            lastMessageAt: new Date().toISOString(),
            unreadCount: 0
          });
        }
      }

      return {
        id: `srv-${Date.now()}`,
        senderRole: "teacher",
        senderName: "Mrs. Silva",
        body,
        sentAt: new Date().toISOString(),
        status: "sent",
        attachments,
        ...(ref.kind === "community"
          ? { recipientCount: mockMembers.length, readCount: 0 }
          : {})
      };
    }
    throw new Error("Not implemented: POST message");
  }
};