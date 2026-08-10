import prisma from "../config/prisma.js";

export async function createFileMetadata({
  schoolId,
  uploadedBy,
  fileName,
  originalName,
  contentType,
  fileSize,
  s3Key,
  s3Bucket,
  purpose,
}) {
  return prisma.fileMetadata.create({
    data: {
      schoolId,
      uploadedBy,
      fileName,
      originalName,
      contentType,
      fileSize,
      s3Key,
      s3Bucket,
      purpose,
      status: "PENDING",
    },
  });
}

export async function updateFileStatus(id, status) {
  return prisma.fileMetadata.update({
    where: { id },
    data: { status },
  });
}

export async function findFileById(id) {
  return prisma.fileMetadata.findUnique({
    where: { id },
  });
}

export async function findFilesBySchool(schoolId, { purpose, limit = 50, offset = 0 } = {}) {
  const where = { schoolId, status: { not: "DELETED" } };

  if (purpose) {
    where.purpose = purpose;
  }

  return prisma.fileMetadata.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

export async function deleteFileMetadata(id) {
  return prisma.fileMetadata.update({
    where: { id },
    data: { status: "DELETED" },
  });
}