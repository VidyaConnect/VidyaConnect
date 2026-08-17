import prisma from "../config/prisma.js";

export async function findOrCreateAttendanceRecord({
  schoolId,
  classId,
  studentId,
  studentName,
  rollNumber,
  date,
  markedById,
}) {
  const existing = await prisma.attendanceRecord.findUnique({
    where: {
      schoolId_studentId_date: { schoolId, studentId, date: new Date(date) },
    },
  });

  if (existing) {
    return prisma.attendanceRecord.update({
      where: { id: existing.id },
      data: {
        status: "NOT_MARKED",
        markedById,
        markedAt: new Date(),
      },
    });
  }

  return prisma.attendanceRecord.create({
    data: {
      schoolId,
      classId,
      studentId,
      studentName,
      rollNumber,
      date: new Date(date),
      status: "NOT_MARKED",
      markedById,
      markedAt: new Date(),
    },
  });
}

export async function markAttendanceBatch(records) {
  const results = [];

  for (const record of records) {
    const result = await prisma.attendanceRecord.upsert({
      where: {
        schoolId_studentId_date: {
          schoolId: record.schoolId,
          studentId: record.studentId,
          date: new Date(record.date),
        },
      },
      update: {
        status: record.status,
        markedById: record.markedById,
        markedAt: new Date(),
      },
      create: {
        schoolId: record.schoolId,
        classId: record.classId,
        studentId: record.studentId,
        studentName: record.studentName,
        rollNumber: record.rollNumber,
        date: new Date(record.date),
        status: record.status,
        markedById: record.markedById,
        markedAt: new Date(),
      },
    });
    results.push(result);
  }

  return results;
}

export async function findAttendanceByClassAndDate(schoolId, classId, date) {
  return prisma.attendanceRecord.findMany({
    where: {
      schoolId,
      classId,
      date: new Date(date),
    },
    orderBy: { rollNumber: "asc" },
  });
}

export async function findAttendanceByStudent(schoolId, studentId, { startDate, endDate } = {}) {
  const where = { schoolId, studentId };

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  return prisma.attendanceRecord.findMany({
    where,
    orderBy: { date: "desc" },
  });
}

export async function findRosterByClass(schoolId, classId) {
  return prisma.classRosterEntry.findMany({
    where: { schoolId, classId, isActive: true },
    orderBy: { rollNumber: "asc" },
  });
}

export async function createAbsenceResponse({
  attendanceRecordId,
  schoolId,
  studentId,
  parentId,
  reason,
  fileId,
  fileName,
}) {
  return prisma.absenceResponse.create({
    data: {
      attendanceRecordId,
      schoolId,
      studentId,
      parentId,
      reason,
      fileId: fileId || null,
      fileName: fileName || null,
    },
  });
}

export async function findAbsenceResponseByRecord(attendanceRecordId) {
  return prisma.absenceResponse.findUnique({
    where: { attendanceRecordId },
  });
}

export async function findAbsenceResponsesByStudent(schoolId, studentId) {
  return prisma.absenceResponse.findMany({
    where: { schoolId, studentId },
    include: { attendanceRecord: true },
    orderBy: { submittedAt: "desc" },
  });
}

export async function updateAbsenceResponseFile(attendanceRecordId, fileId, fileName) {
  return prisma.absenceResponse.update({
    where: { attendanceRecordId },
    data: { fileId, fileName },
  });
}
