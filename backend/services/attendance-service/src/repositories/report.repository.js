// backend/services/attendance-service/src/repositories/report.repository.js
// Read-only aggregate queries for the School Admin reports page.
// The counting is done by PostgreSQL (groupBy), not in JavaScript.
import prisma from "../config/prisma.js";

// NOT_MARKED and EXEMPTED are left out of every percentage.
const COUNTED_STATUSES = ["PRESENT", "LATE", "ABSENT"];

const baseWhere = (schoolId, from, to, classId) => ({
  schoolId,
  date: { gte: from, lte: to },
  status: { in: COUNTED_STATUSES },
  ...(classId && { classId }),
});

export const countByDateAndStatus = async (schoolId, from, to, classId) => {
  return prisma.attendanceRecord.groupBy({
    by: ["date", "status"],
    where: baseWhere(schoolId, from, to, classId),
    _count: { _all: true },
  });
};

export const countByClassAndStatus = async (schoolId, from, to) => {
  return prisma.attendanceRecord.groupBy({
    by: ["classId", "status"],
    where: baseWhere(schoolId, from, to),
    _count: { _all: true },
  });
};

export const countByStudentAndStatus = async (schoolId, from, to, classId) => {
  return prisma.attendanceRecord.groupBy({
    by: ["studentId", "studentName", "classId", "status"],
    where: baseWhere(schoolId, from, to, classId),
    _count: { _all: true },
  });
};
