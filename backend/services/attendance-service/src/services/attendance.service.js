import {
  calculateSummary,
  formatDisplayDate,
  mapStudentRecord,
  startOfDay,
  toDbStatus,
} from "../utils/attendanceMapper.js";
import * as attendanceRepository from "../repositories/attendance.repository.js";
import { ensureSeedRoster } from "../seed/devRoster.seed.js";

function requireSchoolId(user) {
  if (!user.schoolId) {
    const error = new Error("School context is required");
    error.status = 403;
    throw error;
  }

  return user.schoolId;
}

function resolveClassId(user, classId) {
  return classId || user.classId || "class-8a";
}

async function buildRosterResponse(schoolId, classId, date = new Date()) {
  await ensureSeedRoster(schoolId);

  const rosterEntries = await attendanceRepository.findRosterEntries(
    schoolId,
    classId
  );
  const existingRecords = await attendanceRepository.findRecordsForClassDate(
    schoolId,
    classId,
    date
  );

  const recordMap = new Map(
    existingRecords.map((record) => [record.studentId, record])
  );

  const records = rosterEntries.map((entry) => {
    const existing = recordMap.get(entry.studentId);

    if (existing) {
      return existing;
    }

    return {
      studentId: entry.studentId,
      studentName: entry.studentName,
      rollNumber: entry.rollNumber,
      status: "NOT_MARKED",
      absenceResponse: null,
    };
  });

  return {
    className: rosterEntries[0]?.className ?? "Class",
    records,
  };
}

export async function getTeacherSummary(user, classId) {
  const schoolId = requireSchoolId(user);
  const resolvedClassId = resolveClassId(user, classId);
  const date = startOfDay();
  const { className, records } = await buildRosterResponse(
    schoolId,
    resolvedClassId,
    date
  );
  const summary = calculateSummary(records);

  return {
    className,
    date: formatDisplayDate(date),
    present: summary.present,
    absent: summary.absent,
    late: summary.late,
    notMarked: summary.notMarked,
    progress: summary.progress,
  };
}

export async function getTeacherRoster(user, classId) {
  const schoolId = requireSchoolId(user);
  const resolvedClassId = resolveClassId(user, classId);
  const { records } = await buildRosterResponse(
    schoolId,
    resolvedClassId,
    startOfDay()
  );

  return records.map(mapStudentRecord);
}

export async function markStudentAttendance(user, studentId, status) {
  const schoolId = requireSchoolId(user);
  const classId = resolveClassId(user);
  const rosterEntry = await attendanceRepository.findRosterEntryByStudent(
    schoolId,
    studentId
  );

  if (!rosterEntry) {
    const error = new Error("Student not found in class roster");
    error.status = 404;
    throw error;
  }

  if (rosterEntry.classId !== classId) {
    const error = new Error("Student is not in your assigned class");
    error.status = 403;
    throw error;
  }

  const record = await attendanceRepository.upsertAttendanceRecord({
    schoolId,
    classId: rosterEntry.classId,
    studentId,
    studentName: rosterEntry.studentName,
    rollNumber: rosterEntry.rollNumber,
    date: startOfDay(),
    status: toDbStatus(status),
    markedById: user.userId,
  });

  return mapStudentRecord(record);
}

export async function getAdminOverview(user) {
  const schoolId = requireSchoolId(user);
  await ensureSeedRoster(schoolId);

  const classes = await attendanceRepository.listDistinctClasses(schoolId);
  const date = startOfDay();
  const classSummaries = [];

  let present = 0;
  let absent = 0;
  let late = 0;
  let notMarked = 0;

  for (const classEntry of classes) {
    const { className, records } = await buildRosterResponse(
      schoolId,
      classEntry.classId,
      date
    );
    const summary = calculateSummary(records);

    present += summary.present;
    absent += summary.absent;
    late += summary.late;
    notMarked += summary.notMarked;

    classSummaries.push({
      id: classEntry.classId,
      className,
      teacherName: "Assigned Teacher",
      status: summary.notMarked === 0 ? "marked" : "pending",
      progress: summary.progress,
      students: records.map(mapStudentRecord),
    });
  }

  return {
    present,
    absent,
    late,
    notMarked,
    classes: classSummaries,
  };
}

export async function getAdminClassRoster(user, classId) {
  const schoolId = requireSchoolId(user);
  const { records } = await buildRosterResponse(
    schoolId,
    classId,
    startOfDay()
  );

  return records.map(mapStudentRecord);
}

export async function getParentAbsenceAlert(user) {
  const schoolId = requireSchoolId(user);
  const studentId = user.studentId || "student-001";

  await ensureSeedRoster(schoolId);

  const rosterEntry = await attendanceRepository.findRosterEntryByStudent(
    schoolId,
    studentId
  );

  if (!rosterEntry) {
    const error = new Error("Linked student not found");
    error.status = 404;
    throw error;
  }

  let record = await attendanceRepository.findLatestAbsentRecordForStudent(
    schoolId,
    studentId
  );

  if (!record) {
    record = await attendanceRepository.upsertAttendanceRecord({
      schoolId,
      classId: rosterEntry.classId,
      studentId,
      studentName: rosterEntry.studentName,
      rollNumber: rosterEntry.rollNumber,
      date: startOfDay(),
      status: "ABSENT",
      markedById: "system-seed",
    });
  }

  return {
    studentName: rosterEntry.studentName,
    className: rosterEntry.className,
    rollNumber: rosterEntry.rollNumber,
    dateLabel: formatDisplayDate(record.date),
    alertTime: new Date(record.markedAt ?? record.updatedAt).toLocaleTimeString(
      "en-US",
      { hour: "2-digit", minute: "2-digit" }
    ),
    attendanceRecordId: record.id,
    hasSubmittedReason: Boolean(record.absenceResponse),
  };
}

export async function submitAbsenceReason(user, payload) {
  const schoolId = requireSchoolId(user);
  const studentId = user.studentId || "student-001";
  const parentId = user.parentId || user.userId;
  const { reason, fileId = null, fileName = null } = payload;

  if (!reason?.trim()) {
    const error = new Error("Absence reason is required");
    error.status = 400;
    throw error;
  }

  let record = await attendanceRepository.findLatestAbsentRecordForStudent(
    schoolId,
    studentId
  );

  if (!record) {
    const rosterEntry = await attendanceRepository.findRosterEntryByStudent(
      schoolId,
      studentId
    );

    if (!rosterEntry) {
      const error = new Error("No absence record found for linked student");
      error.status = 404;
      throw error;
    }

    record = await attendanceRepository.upsertAttendanceRecord({
      schoolId,
      classId: rosterEntry.classId,
      studentId,
      studentName: rosterEntry.studentName,
      rollNumber: rosterEntry.rollNumber,
      date: startOfDay(),
      status: "ABSENT",
      markedById: "system-seed",
    });
  }

  const absenceResponse = await attendanceRepository.upsertAbsenceResponse({
    attendanceRecordId: record.id,
    schoolId,
    studentId,
    parentId,
    reason: reason.trim(),
    fileId,
    fileName,
  });

  return {
    id: absenceResponse.id,
    attendanceRecordId: record.id,
    reason: absenceResponse.reason,
    fileId: absenceResponse.fileId,
    fileName: absenceResponse.fileName,
    submittedAt: absenceResponse.submittedAt,
  };
}

export async function getStudentAttendanceHistory(user, studentId) {
  const schoolId = requireSchoolId(user);
  const records = await attendanceRepository.findStudentHistory(
    schoolId,
    studentId
  );

  return records.map((record) => ({
    date: record.date.toISOString().slice(0, 10),
    status: mapStudentRecord(record).status,
    reason: record.absenceResponse?.reason ?? null,
    fileId: record.absenceResponse?.fileId ?? null,
    fileName: record.absenceResponse?.fileName ?? null,
  }));
}

export async function linkAbsenceDocument(user, payload) {
  const { fileId, fileName } = payload;

  if (!fileId) {
    const error = new Error("fileId is required to link an absence document");
    error.status = 400;
    throw error;
  }

  return submitAbsenceReason(user, {
    reason: payload.reason || "Document uploaded",
    fileId,
    fileName,
  });
}
