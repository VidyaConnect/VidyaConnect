import { ChatMessage, ChatThreadInfo } from "../types/communication";

export const mockThread: ChatThreadInfo = {
  id: "thread-1",
  teacherName: "Mrs. Silva",
  className: "Class Teacher 8-A",
  availabilityLabel: "Available 4pm - 6pm",
  isTeacherAvailable: false // set true to test the "available" path
};

const today = new Date();
const at = (hour: number, minute: number) => {
  const d = new Date(today);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const mockMessages: ChatMessage[] = [
  {
    id: "m1",
    threadId: "thread-1",
    senderRole: "parent",
    senderName: "Mrs. Perera",
    body: "Hello teacher, about the project for next Friday, does it need to be strictly made of recycled materials or can we use craft supplies?",
    sentAt: at(14, 45),
    status: "read"
  },
  {
    id: "m2",
    threadId: "thread-1",
    senderRole: "teacher",
    senderName: "Mrs. Silva",
    body: 'Yes, you can use any materials. The "Green Project" title was just to emphasize sustainability, but I want the children to focus on structural creativity above all!',
    sentAt: at(14, 52),
    status: "read"
  }
];