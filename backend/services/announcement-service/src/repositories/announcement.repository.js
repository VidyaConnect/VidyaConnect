import prisma from "../config/prisma.js";

export const createAnnouncement = async (announcementData) => {
  return prisma.announcement.create({
    data: announcementData
  });
};

export const getAnnouncements = async () => {
  return prisma.announcement.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const getAnnouncementById = async (id) => {
  return prisma.announcement.findUnique({
    where: { id }
  });
};

export const updateAnnouncementById = async (id, data) => {
  return prisma.announcement.update({
    where: { id },
    data
  });
};

export const deleteAnnouncementById = async (id) => {
  return prisma.announcement.delete({
    where: { id }
  });
};