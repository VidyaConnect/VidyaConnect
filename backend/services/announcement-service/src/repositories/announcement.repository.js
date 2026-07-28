import prisma from "../config/prisma.js";

export const createAnnouncement = async (announcementData) => {
  return prisma.announcement.create({
    data: announcementData,
  });
};