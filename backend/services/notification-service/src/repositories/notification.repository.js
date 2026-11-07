import prisma from "../config/prisma.js";

export const findForUser = async (recipientUserId) => {
  const [notifications, unreadCount] = await prisma.$transaction([
    prisma.notification.findMany({
      where: { recipientUserId },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.notification.count({
      where: { recipientUserId, readAt: null },
    }),
  ]);
  return { notifications, unreadCount };
};

export const markRead = (id, recipientUserId) =>
  prisma.notification.updateMany({
    where: { id, recipientUserId, readAt: null },
    data: { readAt: new Date() },
  });

export const createForRecipients = (announcement, recipientUserIds) =>
  prisma.notification.createMany({
    data: [...new Set(recipientUserIds)].map((recipientUserId) => ({
      recipientUserId,
      title: announcement.title,
      message: announcement.content,
      type: announcement.type,
      sourceId: announcement.id,
    })),
  });
