import {
  createForRecipients,
  findForUser,
  markRead,
} from "../repositories/notification.repository.js";

export const getNotifications = async (req, res) => {
  const data = await findForUser(req.user.userId);
  return res.json({ success: true, data });
};

export const markNotificationRead = async (req, res) => {
  const result = await markRead(req.params.id, req.user.userId);
  if (!result.count) {
    return res.status(404).json({ success: false, message: "Notification not found" });
  }
  return res.json({ success: true, data: { id: req.params.id, readAt: new Date() } });
};

export const createAnnouncementNotifications = async (req, res) => {
  if (req.headers["x-internal-key"] !== process.env.INTERNAL_SERVICE_KEY) {
    return res.status(401).json({ success: false, message: "Invalid internal service key" });
  }

  const { announcement, recipientUserIds } = req.body;
  if (!announcement?.id || !announcement.title || !announcement.content || !Array.isArray(recipientUserIds)) {
    return res.status(400).json({ success: false, message: "Invalid notification payload" });
  }

  const result = await createForRecipients(announcement, recipientUserIds);
  return res.status(201).json({ success: true, data: result });
};
