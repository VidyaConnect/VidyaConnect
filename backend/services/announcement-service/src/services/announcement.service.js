import { createAnnouncement } from "../repositories/announcement.repository.js";

export const createNewAnnouncement = async (
  announcementData,
  user
) => {

  if (!announcementData.title) {
    throw new Error("Announcement title is required");
  }

  if (!announcementData.content) {
    throw new Error("Announcement content is required");
  }

  if (!user) {
    throw new Error("User context not found");
  }

  const announcement = {
    title: announcementData.title,
    content: announcementData.content,
    priority: announcementData.priority || "NORMAL",
    attachmentUrl: announcementData.attachmentUrl || null,
    requiresConfirmation:
      announcementData.requiresConfirmation || false,
    expiresAt: announcementData.expiresAt || null,
    publishedAt: new Date(),
    createdByUserId: user.userId,
    status: "PUBLISHED",
  };

  if (user.role === "SUPER_ADMIN") {
    announcement.type = "SYSTEM";
    announcement.schoolId = null;
  } else if (user.role === "SCHOOL_ADMIN") {
    announcement.type = "SCHOOL";
    announcement.schoolId = user.schoolId;
  } else {
    throw new Error("You are not authorized to create announcements.");
  }

  return await createAnnouncement(announcement);

};