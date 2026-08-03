import {
  createNewAnnouncement,
  getAnnouncementsForParent,
  getAnnouncementByIdForParent,
  recordAnnouncementView,
} from "../services/announcement.service.js";

export const createAnnouncement = async (req, res) => {

  try {

    const announcement = await createNewAnnouncement(
      req.body,
      req.user
    );

    res.status(201).json({
      success: true,
      message: "Announcement created successfully.",
      data: announcement,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

export const getParentAnnouncements = async (req, res) => {
  try {
    const announcements = await getAnnouncementsForParent(req.user);
    res.status(200).json({
      success: true,
      message: "Announcements fetched successfully.",
      data: announcements,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getParentAnnouncementById = async (req, res) => {
  try {
    const announcement = await getAnnouncementByIdForParent(req.params.id, req.user);
    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found." });
    }
    res.status(200).json({
      success: true,
      message: "Announcement fetched successfully.",
      data: announcement,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const markAnnouncementAsViewed = async (req, res) => {
  try {
    await recordAnnouncementView(req.params.id, req.user);
    res.status(200).json({ success: true, message: "Announcement marked as viewed." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};