import {
  createAnnouncement as createAnnouncementRepo,
  getAnnouncements as getAnnouncementsRepo,
  getAnnouncementById as getAnnouncementByIdRepo,
  updateAnnouncementById as updateAnnouncementByIdRepo,
  deleteAnnouncementById as deleteAnnouncementByIdRepo
} from "../repositories/announcement.repository.js";

const ALLOWED_PRIORITY = new Set(["NORMAL", "URGENT", "EMERGENCY"]);
const ALLOWED_TYPE = new Set(["SYSTEM", "SCHOOL"]);
const ALLOWED_STATUS = new Set(["DRAFT", "PUBLISHED", "ARCHIVED"]);

function makeError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeEnum(value, allowedSet, fallback, fieldName) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const normalized = String(value).toUpperCase();
  if (!allowedSet.has(normalized)) {
    throw makeError("Invalid " + fieldName, 400);
  }

  return normalized;
}

function parseDateOrNull(value, fieldName) {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw makeError(fieldName + " must be a valid date", 400);
  }

  return parsed;
}

export const createNewAnnouncement = async (announcementData) => {
  if (!announcementData?.title || !String(announcementData.title).trim()) {
    throw makeError("Announcement title is required", 400);
  }

  if (!announcementData?.content || !String(announcementData.content).trim()) {
    throw makeError("Announcement content is required", 400);
  }

  const payload = {
    title: String(announcementData.title).trim(),
    content: String(announcementData.content).trim(),
    type: normalizeEnum(announcementData.type, ALLOWED_TYPE, "SCHOOL", "type"),
    status: normalizeEnum(announcementData.status, ALLOWED_STATUS, "PUBLISHED", "status"),
    priority: normalizeEnum(announcementData.priority, ALLOWED_PRIORITY, "NORMAL", "priority"),
    schoolId: announcementData.schoolId ?? null,
    createdByUserId: "TEMP_USER",
    attachmentId: announcementData.attachmentId ?? null,
    requiresConfirmation: Boolean(announcementData.requiresConfirmation),
    isRetracted: false,
    publishedAt: new Date(),
    expiresAt: parseDateOrNull(announcementData.expiresAt, "expiresAt")
  };

  return createAnnouncementRepo(payload);
};

export const listAnnouncements = async () => {
  return getAnnouncementsRepo();
};

export const getAnnouncement = async (id) => {
  const record = await getAnnouncementByIdRepo(id);
  if (!record) {
    throw makeError("Announcement not found", 404);
  }
  return record;
};

export const editAnnouncement = async (id, input) => {
  const existing = await getAnnouncementByIdRepo(id);
  if (!existing) {
    throw makeError("Announcement not found", 404);
  }

  const data = {};

  if ("title" in input) {
    if (!input.title || !String(input.title).trim()) {
      throw makeError("Announcement title cannot be empty", 400);
    }
    data.title = String(input.title).trim();
  }

  if ("content" in input) {
    if (!input.content || !String(input.content).trim()) {
      throw makeError("Announcement content cannot be empty", 400);
    }
    data.content = String(input.content).trim();
  }

  if ("priority" in input) {
    data.priority = normalizeEnum(input.priority, ALLOWED_PRIORITY, existing.priority, "priority");
  }

  if ("type" in input) {
    data.type = normalizeEnum(input.type, ALLOWED_TYPE, existing.type, "type");
  }

  if ("status" in input) {
    data.status = normalizeEnum(input.status, ALLOWED_STATUS, existing.status, "status");
  }

  if ("schoolId" in input) {
    data.schoolId = input.schoolId ?? null;
  }

  if ("attachmentId" in input) {
    data.attachmentId = input.attachmentId ?? null;
  }

  if ("requiresConfirmation" in input) {
    data.requiresConfirmation = Boolean(input.requiresConfirmation);
  }

  if ("isRetracted" in input) {
    data.isRetracted = Boolean(input.isRetracted);
  }

  if ("publishedAt" in input) {
    data.publishedAt = parseDateOrNull(input.publishedAt, "publishedAt");
  }

  if ("expiresAt" in input) {
    data.expiresAt = parseDateOrNull(input.expiresAt, "expiresAt");
  }

  if (Object.keys(data).length === 0) {
    throw makeError("No valid fields provided for update", 400);
  }

  return updateAnnouncementByIdRepo(id, data);
};

export const removeAnnouncement = async (id) => {
  const existing = await getAnnouncementByIdRepo(id);
  if (!existing) {
    throw makeError("Announcement not found", 404);
  }

  return deleteAnnouncementByIdRepo(id);
};