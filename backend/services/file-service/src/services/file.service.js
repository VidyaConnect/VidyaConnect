import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client, { S3_BUCKET } from "../config/s3.js";
import * as fileRepository from "../repositories/file.repository.js";
import crypto from "crypto";

const PRESIGNED_URL_EXPIRY = 3600;

function generateS3Key(schoolId, originalName) {
  const timestamp = Date.now();
  const randomId = crypto.randomBytes(8).toString("hex");
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${schoolId}/${timestamp}-${randomId}-${sanitizedName}`;
}

function requireSchoolId(user) {
  if (!user.schoolId) {
    const error = new Error("School context is required");
    error.status = 403;
    throw error;
  }
  return user.schoolId;
}

export async function generateUploadUrl(user, { fileName, contentType, fileSize, purpose }) {
  const schoolId = requireSchoolId(user);

  if (!fileName) {
    const error = new Error("fileName is required");
    error.status = 400;
    throw error;
  }

  if (!contentType) {
    const error = new Error("contentType is required");
    error.status = 400;
    throw error;
  }

  const s3Key = generateS3Key(schoolId, fileName);

  const fileRecord = await fileRepository.createFileMetadata({
    schoolId,
    uploadedBy: user.userId,
    fileName: s3Key.split("/").pop(),
    originalName: fileName,
    contentType,
    fileSize: fileSize || 0,
    s3Key,
    s3Bucket: S3_BUCKET,
    purpose: purpose || null,
  });

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: s3Key,
    ContentType: contentType,
    Metadata: {
      fileId: fileRecord.id,
      schoolId,
      uploadedBy: user.userId,
    },
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: PRESIGNED_URL_EXPIRY,
  });

  return {
    fileId: fileRecord.id,
    uploadUrl,
    s3Key,
    expiresIn: PRESIGNED_URL_EXPIRY,
  };
}

export async function generateDownloadUrl(user, fileId) {
  const schoolId = requireSchoolId(user);

  const fileRecord = await fileRepository.findFileById(fileId);

  if (!fileRecord) {
    const error = new Error("File not found");
    error.status = 404;
    throw error;
  }

  if (fileRecord.schoolId !== schoolId) {
    const error = new Error("Access denied: file belongs to another school");
    error.status = 403;
    throw error;
  }

  if (fileRecord.status === "DELETED") {
    const error = new Error("File has been deleted");
    error.status = 404;
    throw error;
  }

  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: fileRecord.s3Key,
  });

  const downloadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: PRESIGNED_URL_EXPIRY,
  });

  return {
    fileId: fileRecord.id,
    downloadUrl,
    fileName: fileRecord.originalName,
    contentType: fileRecord.contentType,
    expiresIn: PRESIGNED_URL_EXPIRY,
  };
}

export async function confirmUpload(user, fileId) {
  const schoolId = requireSchoolId(user);

  const fileRecord = await fileRepository.findFileById(fileId);

  if (!fileRecord) {
    const error = new Error("File not found");
    error.status = 404;
    throw error;
  }

  if (fileRecord.schoolId !== schoolId) {
    const error = new Error("Access denied: file belongs to another school");
    error.status = 403;
    throw error;
  }

  const updated = await fileRepository.updateFileStatus(fileId, "COMPLETED");

  return {
    fileId: updated.id,
    fileName: updated.originalName,
    contentType: updated.contentType,
    fileSize: updated.fileSize,
    status: updated.status,
    s3Key: updated.s3Key,
    createdAt: updated.createdAt,
  };
}

export async function getFileMetadata(user, fileId) {
  const schoolId = requireSchoolId(user);

  const fileRecord = await fileRepository.findFileById(fileId);

  if (!fileRecord) {
    const error = new Error("File not found");
    error.status = 404;
    throw error;
  }

  if (fileRecord.schoolId !== schoolId) {
    const error = new Error("Access denied: file belongs to another school");
    error.status = 403;
    throw error;
  }

  return {
    fileId: fileRecord.id,
    fileName: fileRecord.originalName,
    contentType: fileRecord.contentType,
    fileSize: fileRecord.fileSize,
    status: fileRecord.status,
    purpose: fileRecord.purpose,
    uploadedBy: fileRecord.uploadedBy,
    createdAt: fileRecord.createdAt,
  };
}

export async function listFiles(user, { purpose, limit, offset } = {}) {
  const schoolId = requireSchoolId(user);

  const files = await fileRepository.findFilesBySchool(schoolId, {
    purpose,
    limit,
    offset,
  });

  return files.map((f) => ({
    fileId: f.id,
    fileName: f.originalName,
    contentType: f.contentType,
    fileSize: f.fileSize,
    status: f.status,
    purpose: f.purpose,
    uploadedBy: f.uploadedBy,
    createdAt: f.createdAt,
  }));
}

export async function deleteFile(user, fileId) {
  const schoolId = requireSchoolId(user);

  const fileRecord = await fileRepository.findFileById(fileId);

  if (!fileRecord) {
    const error = new Error("File not found");
    error.status = 404;
    throw error;
  }

  if (fileRecord.schoolId !== schoolId) {
    const error = new Error("Access denied: file belongs to another school");
    error.status = 403;
    throw error;
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: fileRecord.s3Key,
    });
    await s3Client.send(command);
  } catch {
    // S3 delete is best-effort; metadata is soft-deleted regardless
  }

  await fileRepository.deleteFileMetadata(fileId);

  return { fileId, deleted: true };
}