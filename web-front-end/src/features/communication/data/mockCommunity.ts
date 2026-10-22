import { ChatMessage, ClassCommunity, ClassMember } from "../types/communication";

export const mockMembers: ClassMember[] = [
  { id: "p-perera", parentName: "Mrs. Perera", studentName: "Kavindu Perera", relation: "Mother" },
  { id: "p-fernando", parentName: "Mr. Fernando", studentName: "Nethmi Fernando", relation: "Father" },
  { id: "p-jayasinghe", parentName: "Mrs. Jayasinghe", studentName: "Sahan Jayasinghe", relation: "Mother" },
  { id: "p-wickrama", parentName: "Mr. Wickramasinghe", studentName: "Dilini Wickramasinghe", relation: "Father" },
  { id: "p-rajapaksa", parentName: "Mrs. Rajapaksa", studentName: "Ishara Rajapaksa", relation: "Mother" },
  { id: "p-bandara", parentName: "Mr. Bandara", studentName: "Tharushi Bandara", relation: "Father" },
  { id: "p-demel", parentName: "Mrs. De Mel", studentName: "Ravindu De Mel", relation: "Mother" },
  { id: "p-kumar", parentName: "Mr. Kumar", studentName: "Arjun Kumar", relation: "Father" }
];

export const mockCommunity: ClassCommunity = {
  classId: "8-a",
  name: "Grade 8A",
  title: "Grade 8A Community",
  teacherName: "Mrs. Silva",
  memberCount: mockMembers.length
};

const at = (daysAgo: number, hour: number, minute: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const mockCommunityMessages: ChatMessage[] = [
  {
    id: "c1",
    senderRole: "teacher",
    senderName: "Mrs. Silva",
    body: "Dear parents, the Green Project is due next Friday. Children may use any materials, including craft supplies. The focus is structural creativity.",
    sentAt: at(1, 16, 10),
    status: "sent",
    recipientCount: mockMembers.length,
    readCount: mockMembers.length
  },
  {
    id: "c2",
    senderRole: "parent",
    senderName: "Mrs. Perera",
    senderSubtitle: "Parent of Kavindu Perera",
    body: "Thank you, Mrs. Silva! Kavindu will use his wooden blocks.",
    sentAt: at(1, 16, 40),
    status: "sent"
  },
  {
    id: "c3",
    senderRole: "teacher",
    senderName: "Mrs. Silva",
    body: "Reminder: Sports Day is on Dec 12 at 8:30 AM. Please send students in their house colours. The schedule is attached.",
    sentAt: at(0, 9, 5),
    status: "sent",
    recipientCount: mockMembers.length,
    readCount: 5,
    attachments: [{ id: "a1", name: "Sports-Day-Schedule.pdf", sizeLabel: "240 KB" }]
  }
];

export const mockDirectMessagesPerera: ChatMessage[] = [
  {
    id: "d1",
    senderRole: "parent",
    senderName: "Mrs. Perera",
    body: "Hello teacher, about the project for next Friday, does it need to be strictly made of recycled materials or can we use craft supplies?",
    sentAt: at(0, 14, 45),
    status: "sent"
  },
  {
    id: "d2",
    senderRole: "teacher",
    senderName: "Mrs. Silva",
    body: 'Yes, you can use any materials. The "Green Project" title was just to emphasize sustainability, but I want the children to focus on structural creativity above all!',
    sentAt: at(0, 14, 52),
    status: "sent"
  }
];

export const mockInboxSeed = [
  { parentId: "p-perera", lastMessage: "Thank you, Kavindu will use his wooden blocks.", lastMessageAt: at(0, 15, 10), unreadCount: 2 },
  { parentId: "p-fernando", lastMessage: "Will Nethmi need the PE kit on Friday?", lastMessageAt: at(0, 11, 30), unreadCount: 1 },
  { parentId: "p-jayasinghe", lastMessage: "Sahan has a dentist appointment tomorrow.", lastMessageAt: at(1, 17, 5), unreadCount: 0 },
  { parentId: "p-kumar", lastMessage: "Thanks for the update, teacher.", lastMessageAt: at(3, 9, 20), unreadCount: 0 }
];