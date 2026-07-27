const STATUS_MAP = {
  present: "PRESENT",
  absent: "ABSENT",
  late: "LATE",
  exempted: "EXEMPTED",
  notMarked: "NOT_MARKED",
  P: "PRESENT",
  A: "ABSENT",
  L: "LATE",
  E: "EXEMPTED",
};

const RESPONSE_STATUS_MAP = {
  PRESENT: "present",
  ABSENT: "absent",
  LATE: "late",
  EXEMPTED: "exempted",
  NOT_MARKED: "notMarked",
};

export function toDbStatus(status) {
  const normalized = STATUS_MAP[status];

  if (!normalized) {
    throw new Error(`Invalid attendance status: ${status}`);
  }

  return normalized;
}

export function toApiStatus(status) {
  return RESPONSE_STATUS_MAP[status] ?? "notMarked";
}

export function startOfDay(date = new Date()) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

export function formatDisplayDate(date = new Date()) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function calculateSummary(records) {
  const summary = {
    present: 0,
    absent: 0,
    late: 0,
    notMarked: 0,
  };

  for (const record of records) {
    switch (record.status) {
      case "PRESENT":
        summary.present += 1;
        break;
      case "ABSENT":
        summary.absent += 1;
        break;
      case "LATE":
        summary.late += 1;
        break;
      default:
        summary.notMarked += 1;
        break;
    }
  }

  const total = records.length;
  const marked = total - summary.notMarked;
  const progress = total === 0 ? 0 : Math.round((marked / total) * 100);

  return { ...summary, progress, total };
}

export function mapStudentRecord(record) {
  return {
    id: record.studentId,
    name: record.studentName,
    rollNumber: record.rollNumber,
    status: toApiStatus(record.status),
    absenceReason: record.absenceResponse?.reason ?? null,
    fileId: record.absenceResponse?.fileId ?? null,
    fileName: record.absenceResponse?.fileName ?? null,
  };
}
