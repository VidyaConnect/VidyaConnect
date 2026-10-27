import prisma from "../config/prisma.js";

const assignmentInclude = {
  attachments: true,
  studentStatuses: { orderBy: { studentName: "asc" } },
};

export const listAssignments = (schoolId, classIds) => prisma.assignment.findMany({
  where: { schoolId, classId: { in: classIds } },
  include: assignmentInclude,
  orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
});

export const findAssignment = (schoolId, id) => prisma.assignment.findFirst({
  where: { schoolId, id },
  include: assignmentInclude,
});

export const createAssignment = (data) => prisma.$transaction(async (tx) => {
  const { attachments, studentStatuses, ...assignmentData } = data;
  return tx.assignment.create({
    data: {
      ...assignmentData,
      attachments: attachments.length ? { create: attachments } : undefined,
      studentStatuses: studentStatuses.length ? { create: studentStatuses } : undefined,
    },
    include: assignmentInclude,
  });
});

export const updateAssignment = (schoolId, id, data) => prisma.assignment.updateMany({
  where: { schoolId, id },
  data,
});

export const updateDraft = (schoolId, id, data) => prisma.$transaction(async (tx) => {
  const { attachments, ...assignmentData } = data;
  const result = await tx.assignment.updateMany({
    where: { schoolId, id, status: "DRAFT" },
    data: assignmentData,
  });
  if (!result.count) return 0;
  if (attachments) {
    await tx.assignmentAttachment.deleteMany({ where: { assignmentId: id } });
    if (attachments.length) {
      await tx.assignmentAttachment.createMany({ data: attachments.map((attachment) => ({ ...attachment, assignmentId: id })) });
    }
  }
  const draft = await tx.assignment.findFirst({ where: { schoolId, id, status: "DRAFT" }, select: { id: true } });
  return draft ? result.count : 0;
});

export const deleteDraft = (schoolId, id) => prisma.assignment.deleteMany({
  where: { schoolId, id, status: "DRAFT" },
});

export const updateStudentStatus = (schoolId, assignmentId, studentId, data) =>
  prisma.assignmentStudentStatus.updateMany({
    where: { schoolId, assignmentId, studentId },
    data,
  });
