import prisma from "../config/prisma.js";

export const createAnnouncement = async (announcementData) => {
  return prisma.announcement.create({
    data: announcementData,
  });
};

export const findAnnouncementsForParent = async (schoolId) => {
  return prisma.announcement.findMany({
    where: {
      status: "PUBLISHED",
      isRetracted: false,
      publishedAt: { lte: new Date() },
      OR: [
        { type: "SYSTEM" },
        { type: "SCHOOL", schoolId },
      ],
    },
    orderBy: { publishedAt: "desc" },
  });
};

export const findAnnouncementById = async (id) => {
  return prisma.announcement.findUnique({ where: { id } });
};

export const upsertAnnouncementView = async (announcementId, userId, role) => {
  return prisma.announcementView.upsert({
    where: { announcementId_userId: { announcementId, userId } },
    update: { viewedAt: new Date() },
    create: { announcementId, userId, role },
  });
};
