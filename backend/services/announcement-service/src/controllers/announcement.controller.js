import {
  createNewAnnouncement,
  listAnnouncements,
  getAnnouncement,
  editAnnouncement,
  removeAnnouncement
} from "../services/announcement.service.js";

function sendError(res, error) {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error"
  });
}

export const createAnnouncement = async (req, res) => {
  try {
    const created = await createNewAnnouncement(req.body);
    return res.status(201).json({
      success: true,
      data: created
    });
  } catch (error) {
    console.error("Create announcement error:", error);
    return sendError(res, error);
  }
};

export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await listAnnouncements();
    return res.status(200).json({
      success: true,
      data: announcements
    });
  } catch (error) {
    console.error("Get all announcements error:", error);
    return sendError(res, error);
  }
};

export const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await getAnnouncement(req.params.id);
    return res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    console.error("Get announcement by id error:", error);
    return sendError(res, error);
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const updated = await editAnnouncement(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error("Update announcement error:", error);
    return sendError(res, error);
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const deleted = await removeAnnouncement(req.params.id);
    return res.status(200).json({
      success: true,
      data: deleted
    });
  } catch (error) {
    console.error("Delete announcement error:", error);
    return sendError(res, error);
  }
};