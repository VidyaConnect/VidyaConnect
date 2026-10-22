import prisma from "../config/prisma.js";

const assignmentInclude = {
  attachments: true,
  studentStatuses: { orderBy: { studentName: "asc" } },
};

export const listAssignments = (schoolId, classId) => prisma.assignment.findMany({
  where: { schoolId, classId },
  include: assignmentInclude,
  orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
});

export const findAssignment = (schoolId, id) => prisma.assignment.findFirst({
  where: { schoolId, id },
  include: assignmentInclude,
});

export const createAssignment = (data) => prisma.assignment.create({
  data: {
    ...data,
    attachments: { create: data.attachments },
    studentStatuses: { create: data.studentStatuses },
  },
  include: assignmentInclude,
});

export const updateAssignment = (schoolId, id, data) => prisma.assignment.updateMany({
  where: { schoolId, id },
  data,
});

export const updateStudentStatus = (schoolId, assignmentId, studentId, data) =>
  prisma.assignmentStudentStatus.updateMany({
    where: { schoolId, assignmentId, studentId },
    data,
  });
