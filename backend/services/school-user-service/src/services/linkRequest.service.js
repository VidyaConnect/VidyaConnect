import crypto from "crypto";
import prisma from "../config/prisma.js";
import { httpError } from "../utils/httpError.js";
import { uploadFile } from "./fileStorage.service.js";

const EXT = { "image/jpeg": "jpg", "image/png": "png", "application/pdf": "pdf" };

// keycloakId = the ID from the login token (req.user.userId)
const findParentByKeycloakId = (keycloakId) =>
  prisma.parent.findFirst({ where: { user: { keycloakId } } });

export const createLinkRequest = async (keycloakId, body, file) => {
  const parent = await findParentByKeycloakId(keycloakId);
  if (!parent) throw httpError(403, "Parent profile not found.");

  const duplicate = await prisma.linkRequest.findFirst({
    where: {
      parentId: parent.id,
      censusNumber: body.censusNumber,
      admissionNumber: body.admissionNumber,
      status: { in: ["PENDING", "APPROVED"] },
    },
    select: { id: true },
  });
  if (duplicate) throw httpError(409, "A link request for this child already exists.");

  // A miss is not an error, so nobody can probe which admission numbers exist.
  const school = await prisma.school.findUnique({
    where: { censusNumber: body.censusNumber },
    select: { id: true },
  });
  const student = school
    ? await prisma.student.findFirst({
        where: {
          schoolId: school.id,
          admissionNumber: { equals: body.admissionNumber, mode: "insensitive" },
        },
        select: { id: true },
      })
    : null;

  const key = `link-documents/${parent.id}/${crypto.randomUUID()}.${EXT[file.mimetype]}`;
  try {
    await uploadFile(key, file.buffer, file.mimetype);
  } catch (e) {
    console.error("Link document upload failed:", e.message);
    throw httpError(502, "Document upload failed.");
  }

  return prisma.linkRequest.create({
    data: {
      parentId: parent.id,
      admissionNumber: body.admissionNumber,
      schoolName: body.schoolName,
      censusNumber: body.censusNumber,
      nic: body.nic,
      relationship: body.relationship,
      documentPath: key,
      schoolId: school?.id,
      studentId: student?.id,
    },
    select: {
      id: true,
      admissionNumber: true,
      schoolName: true,
      relationship: true,
      status: true,
      createdAt: true,
    },
  });
};

export const listMyLinkRequests = async (keycloakId) => {
  const parent = await findParentByKeycloakId(keycloakId);
  if (!parent) return [];
  return prisma.linkRequest.findMany({
    where: { parentId: parent.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      admissionNumber: true,
      schoolName: true,
      relationship: true,
      status: true,
      rejectReason: true,
      createdAt: true,
    },
  });
};

export const listMyChildren = async (keycloakId) => {
  const parent = await findParentByKeycloakId(keycloakId);
  if (!parent) return [];

  const [students, requests] = await Promise.all([
    prisma.student.findMany({
      where: { parentId: parent.id, isActive: true },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        admissionNumber: true,
        user: { select: { fullName: true } },
        class: { select: { className: true, gradeLevel: true } },
        school: { select: { name: true } },
      },
    }),
    prisma.linkRequest.findMany({
      where: { parentId: parent.id, status: { in: ["PENDING", "REJECTED"] } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        admissionNumber: true,
        schoolName: true,
        status: true,
        rejectReason: true,
      },
    }),
  ]);

  const linked = students.map((s) => ({
    id: s.id,
    status: "LINKED",
    name: s.user.fullName,
    grade: s.class ? `${s.class.gradeLevel}-${s.class.className}` : null,
    school: s.school.name,
    admissionNumber: s.admissionNumber,
  }));

  const open = requests.map((r) => ({
    id: r.id,
    status: r.status, // PENDING or REJECTED
    name: null,
    grade: null,
    school: r.schoolName,
    admissionNumber: r.admissionNumber,
    rejectReason: r.rejectReason,
  }));

  return [...linked, ...open];
};