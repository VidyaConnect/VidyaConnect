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

async function validateAttachment(req, attachmentId, type) {
  if (!attachmentId) return;
  const baseUrl = process.env.FILE_SERVICE_URL || "http://file-service:3006";
  const response = await fetch(`${baseUrl}/files/${encodeURIComponent(attachmentId)}`, {
    headers: { Authorization: req.headers.authorization || "" },
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.success || result.data?.status !== "COMPLETED") {
    const error = new Error("Attachment is unavailable or not uploaded");
    error.statusCode = response.status === 404 ? 400 : response.status || 503;
    throw error;
  }

  const metadata = result.data;
  const validScope = type === "SYSTEM"
    ? metadata.schoolId === "__system__"
    : Boolean(req.user.schoolId) && metadata.schoolId === req.user.schoolId;
  if (!validScope) {
    const error = new Error("Attachment must belong to the announcement's audience");
    error.statusCode = 403;
    throw error;
  }
}

export const createAnnouncement = async (req, res) => {
  try {
    const type = String(req.body.type || "SCHOOL").toUpperCase();
    await validateAttachment(req, req.body.attachmentId, type);
    const created = await createNewAnnouncement({ ...req.body, user: req.user });
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
    if ("attachmentId" in req.body) {
      const existing = await getAnnouncement(req.params.id);
      const type = String(req.body.type || existing.type).toUpperCase();
      await validateAttachment(req, req.body.attachmentId, type);
    }
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
