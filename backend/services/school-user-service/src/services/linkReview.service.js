import prisma from "../config/prisma.js";
import { httpError } from "../utils/httpError.js";
import { downloadFile } from "./fileStorage.service.js";

// keycloakId = the ID from the login token (req.user.userId)
const getReviewer = async (keycloakId) => {
  const user = await prisma.user.findUnique({
    where: { keycloakId },
    select: { id: true, role: true, schoolId: true },
  });
  if (!user) throw httpError(403, "User not found.");
  return user;
};

// Which requests this person may see and decide
const scopeWhere = (u) => {
  switch (u.role) {
    case "TEACHER":
      return { student: { class: { classTeacher: { userId: u.id } } } };
    case "SCHOOL_ADMIN":
      return { schoolId: u.schoolId ?? "__none__" };
    case "ADMIN":
      return {};
    default:
      throw httpError(403, "Not allowed.");
  }
};

const STATUSES = ["PENDING", "APPROVED", "REJECTED"];

export const listPending = async (keycloakId, status = "PENDING") => {
  const wanted = String(status).toUpperCase();
  if (!STATUSES.includes(wanted)) throw httpError(400, "Invalid status.");

  const reviewer = await getReviewer(keycloakId);
  const rows = await prisma.linkRequest.findMany({
    where: { status: wanted, ...scopeWhere(reviewer) },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      status: true,
      parentId: true,
      admissionNumber: true,
      schoolName: true,
      relationship: true,
      nic: true, // sensitive: staff only, never log it
      createdAt: true,
      reviewedAt: true,
      rejectReason: true,
      parent: { select: { user: { select: { fullName: true, phone: true } } } },
      student: {
        select: {
          parentId: true,
          admissionNumber: true,
          user: { select: { fullName: true } },
          class: { select: { className: true, gradeLevel: true } },
        },
      },
    },
  });

  // Tell the board if a different parent is already linked to this student
  return rows.map(({ parentId, ...r }) => ({
    ...r,
    studentAlreadyLinked: Boolean(
      r.student?.parentId && r.student.parentId !== parentId
    ),
  }));
};

export const getDocument = async (keycloakId, requestId) => {
  const reviewer = await getReviewer(keycloakId);
  const request = await prisma.linkRequest.findFirst({
    where: { id: requestId, ...scopeWhere(reviewer) },
    select: { documentPath: true },
  });
  if (!request) throw httpError(404, "Request not found.");
  return downloadFile(request.documentPath);
};

export const reviewRequest = async (keycloakId, requestId, decision, rejectReason) => {
  const reviewer = await getReviewer(keycloakId);

  return prisma.$transaction(async (tx) => {
    const request = await tx.linkRequest.findFirst({
      where: { id: requestId, status: "PENDING", ...scopeWhere(reviewer) },
    });
    if (!request) throw httpError(404, "Request not found or already reviewed.");

    if (decision === "APPROVED") {
      if (!request.studentId) {
        throw httpError(422, "No matching student. Reject it, or ask the school admin to handle it.");
      }
      // Links only if the student has no parent yet (or already this parent)
      const linked = await tx.student.updateMany({
        where: {
          id: request.studentId,
          OR: [{ parentId: null }, { parentId: request.parentId }],
        },
        data: { parentId: request.parentId },
      });
      if (linked.count === 0) {
        throw httpError(409, "This student is already linked to another parent.");
      }
      if (request.schoolId) {
        await tx.parent.updateMany({
          where: { id: request.parentId, schoolId: null },
          data: { schoolId: request.schoolId },
        });
      }
    } else if (!rejectReason?.trim()) {
      throw httpError(400, "A reason is required when rejecting.");
    }

    return tx.linkRequest.update({
      where: { id: request.id },
      data: {
        status: decision,
        reviewedById: reviewer.id,
        reviewedAt: new Date(),
        rejectReason: decision === "REJECTED" ? rejectReason.trim() : null,
      },
      select: { id: true, status: true, reviewedAt: true },
    });
  });
};

export const revertRequest = async (keycloakId, requestId) => {
  const reviewer = await getReviewer(keycloakId);

  return prisma.$transaction(async (tx) => {
    const request = await tx.linkRequest.findFirst({
      where: {
        id: requestId,
        status: { in: ["APPROVED", "REJECTED"] },
        ...scopeWhere(reviewer),
      },
    });
    if (!request) throw httpError(404, "Request not found or already in review.");

    // If it was approved, remove the parent link from the student
    if (request.status === "APPROVED" && request.studentId) {
      await tx.student.updateMany({
        where: { id: request.studentId, parentId: request.parentId },
        data: { parentId: null },
      });
    }

    return tx.linkRequest.update({
      where: { id: request.id },
      data: {
        status: "PENDING",
        reviewedById: null,
        reviewedAt: null,
        rejectReason: null,
      },
      select: { id: true, status: true, reviewedAt: true },
    });
  });
};