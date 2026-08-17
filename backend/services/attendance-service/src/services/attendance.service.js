import * as attendanceRepository from "../repositories/attendance.repository.js";

function requireSchoolId(user) {
  if (!user.schoolId) {
    const error = new Error("School context is required");
    error.status = 403;
    throw error;
  }
  return user.schoolId;
}

export async function markAttendance(user, { classId, date, records }) {
  const schoolId = requireSchoolId(user);

  if (!classId || !date || !records || !Array.isArray(records)) {
    const error = new Error("classId, date, and records array are required");
    error.status = 400;
    throw error;
  }

  const attendanceRecords = records.map((r) => ({
    schoolId,
    classId,
    studentId: r.studentId,
    studentName: r.studentName,
    rollNumber: r.rollNumber,
    date,
    status: r.status,
    markedById: user.userId,
  }));

  const results = await attendanceRepository.markAttendanceBatch(attendanceRecords);

  return {
    classId,
    date,
    markedCount: results.length,
    records: results.map((r) => ({
      id: r.id,
      studentId: r.studentId,
      status: r.status,
      markedAt: r.markedAt,
    })),
  };
}

export async function getAttendanceByClass(user, classId, date) {
  const schoolId = requireSchoolId(user);

  if (!classId || !date) {
    const error = new Error("classId and date are required");
    error.status = 400;
    throw error;
  }

  const records = await attendanceRepository.findAttendanceByClassAndDate(schoolId, classId, date);

  return {
    classId,
    date,
    records: records.map((r) => ({
      id: r.id,
      studentId: r.studentId,
      studentName: r.studentName,
      rollNumber: r.rollNumber,
      status: r.status,
      markedById: r.markedById,
      markedAt: r.markedAt,
    })),
  };
}

export async function getStudentAttendance(user, studentId, { startDate, endDate } = {}) {
  const schoolId = requireSchoolId(user);

  if (!studentId) {
    const error = new Error("studentId is required");
    error.status = 400;
    throw error;
  }

  const records = await attendanceRepository.findAttendanceByStudent(schoolId, studentId, {
    startDate,
    endDate,
  });

  return {
    studentId,
    records: records.map((r) => ({
      id: r.id,
      date: r.date,
      status: r.status,
      classId: r.classId,
    })),
  };
}

export async function submitAbsenceResponse(user, { attendanceRecordId, reason, fileId, fileName }) {
  const schoolId = requireSchoolId(user);

  if (!attendanceRecordId || !reason) {
    const error = new Error("attendanceRecordId and reason are required");
    error.status = 400;
    throw error;
  }

  const existing = await attendanceRepository.findAbsenceResponseByRecord(attendanceRecordId);
  if (existing) {
    const error = new Error("Absence response already submitted for this record");
    error.status = 409;
    throw error;
  }

  const response = await attendanceRepository.createAbsenceResponse({
    attendanceRecordId,
    schoolId,
    studentId: user.studentId || user.userId,
    parentId: user.userId,
    reason,
    fileId: fileId || null,
    fileName: fileName || null,
  });

  return {
    id: response.id,
    attendanceRecordId: response.attendanceRecordId,
    reason: response.reason,
    fileId: response.fileId,
    fileName: response.fileName,
    submittedAt: response.submittedAt,
  };
}

export async function getAbsenceResponses(user, studentId) {
  const schoolId = requireSchoolId(user);

  const responses = await attendanceRepository.findAbsenceResponsesByStudent(schoolId, studentId);

  return responses.map((r) => ({
    id: r.id,
    attendanceRecordId: r.attendanceRecordId,
    reason: r.reason,
    fileId: r.fileId,
    fileName: r.fileName,
    submittedAt: r.submittedAt,
    attendance: {
      date: r.attendanceRecord.date,
      status: r.attendanceRecord.status,
      classId: r.attendanceRecord.classId,
    },
  }));
}
