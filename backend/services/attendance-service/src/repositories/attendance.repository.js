import prisma from "../config/prisma.js";
import { startOfDay } from "../utils/attendanceMapper.js";

export async function findRosterEntries(schoolId, classId) {
  return prisma.classRosterEntry.findMany({
    where: {
      schoolId,
      classId,
      isActive: true,
    },
    orderBy: { rollNumber: "asc" },
  });
}

export async function findRecordsForClassDate(schoolId, classId, date) {
  return prisma.attendanceRecord.findMany({
    where: {
      schoolId,
      classId,
      date: startOfDay(date),
    },
    include: {
      absenceResponse: true,
    },
    orderBy: { rollNumber: "asc" },
  });
}

export async function findRecordsForSchoolDate(schoolId, date) {
  return prisma.attendanceRecord.findMany({
    where: {
      schoolId,
      date: startOfDay(date),
    },
    include: {
      absenceResponse: true,
    },
    orderBy: [{ classId: "asc" }, { rollNumber: "asc" }],
  });
}

export async function findRecordByStudentDate(schoolId, studentId, date) {
  return prisma.attendanceRecord.findUnique({
    where: {
      schoolId_studentId_date: {
        schoolId,
        studentId,
        date: startOfDay(date),
      },
    },
    include: {
      absenceResponse: true,
    },
  });
}

export async function upsertAttendanceRecord({
  schoolId,
  classId,
  studentId,
  studentName,
  rollNumber,
  date,
  status,
  markedById,
}) {
  return prisma.attendanceRecord.upsert({
    where: {
      schoolId_studentId_date: {
        schoolId,
        studentId,
        date: startOfDay(date),
      },
    },
    create: {
      schoolId,
      classId,
      studentId,
      studentName,
      rollNumber,
      date: startOfDay(date),
      status,
      markedById,
      markedAt: new Date(),
    },
    update: {
      status,
      markedById,
      markedAt: new Date(),
    },
    include: {
      absenceResponse: true,
    },
  });
}

export async function findLatestAbsentRecordForStudent(schoolId, studentId) {
  return prisma.attendanceRecord.findFirst({
    where: {
      schoolId,
      studentId,
      status: "ABSENT",
    },
    include: {
      absenceResponse: true,
    },
    orderBy: { date: "desc" },
  });
}

export async function findStudentHistory(schoolId, studentId, limit = 30) {
  return prisma.attendanceRecord.findMany({
    where: {
      schoolId,
      studentId,
    },
    include: {
      absenceResponse: true,
    },
    orderBy: { date: "desc" },
    take: limit,
  });
}

export async function upsertAbsenceResponse({
  attendanceRecordId,
  schoolId,
  studentId,
  parentId,
  reason,
  fileId,
  fileName,
}) {
  return prisma.absenceResponse.upsert({
    where: { attendanceRecordId },
    create: {
      attendanceRecordId,
      schoolId,
      studentId,
      parentId,
      reason,
      fileId,
      fileName,
    },
    update: {
      reason,
      fileId,
      fileName,
      parentId,
    },
  });
}

export async function listDistinctClasses(schoolId) {
  return prisma.classRosterEntry.findMany({
    where: { schoolId, isActive: true },
    distinct: ["classId"],
    select: {
      classId: true,
      className: true,
    },
    orderBy: { className: "asc" },
  });
}

export async function findRosterEntryByStudent(schoolId, studentId) {
  return prisma.classRosterEntry.findFirst({
    where: {
      schoolId,
      studentId,
      isActive: true,
    },
  });
}
