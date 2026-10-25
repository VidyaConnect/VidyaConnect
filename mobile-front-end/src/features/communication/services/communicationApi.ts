import { Attachment, ChatMessage, ChatThreadInfo } from "../types/communication";
import { mockMessages, mockThread } from "../data/mockChat";

/**
 * Flip to false when the communication microservice is ready.
 * Then implement the three functions below with your axios instance
 * (src/services/api.ts), e.g. api.get(`/communication/threads/${id}`).
 */
const USE_MOCK = true;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const communicationApi = {
  async getThread(threadId: string): Promise<ChatThreadInfo> {
    if (USE_MOCK) {
      await wait(400);
      return { ...mockThread, id: threadId };
    }
    throw new Error("Not implemented: GET /communication/threads/:id");
  },

  async getMessages(threadId: string): Promise<ChatMessage[]> {
    if (USE_MOCK) {
      await wait(400);
      return mockMessages.map((m) => ({ ...m, threadId }));
    }
    throw new Error("Not implemented: GET /communication/threads/:id/messages");
  },

  /** Server must stamp id + sentAt and store the message immutably (audit). */
  async sendMessage(
    threadId: string,
    body: string,
    attachments: Attachment[] = []
  ): Promise<ChatMessage> {
    if (USE_MOCK) {
      await wait(700);
      if (body.includes("#fail")) throw new Error("Simulated failure");
      return {
        id: `srv-${Date.now()}`,
        threadId,
        senderRole: "parent",
        senderName: "Mrs. Perera",
        body,
        sentAt: new Date().toISOString(),
        status: "sent",
        attachments,
        deliveryNote: mockThread.isTeacherAvailable
          ? undefined
          : "Teacher is unavailable. Message will be delivered later."
      };
    }
    throw new Error("Not implemented: POST /communication/threads/:id/messages");
  }
};