// backend/services/attendance-service/src/services/report.service.js
import { listDistinctClasses } from "../repositories/attendance.repository.js";
import * as reportRepository from "../repositories/report.repository.js";

const THRESHOLD = 80; // students below this % are listed
const MIN_MARKED_DAYS = 5; // ignore students with too few marked days
const MAX_STUDENTS = 50;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const startOfTodayUtc = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};
const addDays = (date, n) => new Date(date.getTime() + n * MS_PER_DAY);
const isoDay = (date) => date.toISOString().slice(0, 10);

// Present and late count as attending. Result has one decimal, e.g. 92.4
const percent = (attended, total) =>
  total === 0 ? null : Math.round((attended / total) * 1000) / 10;

function addCount(map, key, status, n, extra = {}) {
  const entry = map.get(key) ?? { attended: 0, total: 0, ...extra };
  entry.total += n;
  if (status !== "ABSENT") entry.attended += n;
  map.set(key, entry);
}

export const getSchoolAttendanceSummary = async (schoolId, { days, classId }) => {
  const to = startOfTodayUtc();
  const from = addDays(to, -(days - 1));
  const fetchFrom = addDays(from, -7); // one extra week, to compare with "last week"

  const [dateRows, classRows, studentRows, classes] = await Promise.all([
    reportRepository.countByDateAndStatus(schoolId, fetchFrom, to, classId),
    reportRepository.countByClassAndStatus(schoolId, from, to),
    reportRepository.countByStudentAndStatus(schoolId, from, to, classId),
    listDistinctClasses(schoolId),
  ]);

  const classNameById = new Map(classes.map((c) => [c.classId, c.className]));

  // ---- one rate per day ----
  const perDay = new Map();
  for (const row of dateRows) {
    addCount(perDay, isoDay(row.date), row.status, row._count._all);
  }
  const allDaily = [...perDay.entries()]
    .map(([date, v]) => ({ date, rate: percent(v.attended, v.total) }))
    .sort((a, b) => a.date.localeCompare(b.date));
  const daily = allDaily.filter((d) => d.date >= isoDay(from));

  // ---- "today" = the most recent day that has marked attendance ----
  const latest = daily.length > 0 ? daily[daily.length - 1] : null;
  let attendanceChange = null;
  if (latest) {
    const sameDayLastWeek = isoDay(addDays(new Date(latest.date), -7));
    const lastWeek = allDaily.find((d) => d.date === sameDayLastWeek);
    if (lastWeek) attendanceChange = Math.round((latest.rate - lastWeek.rate) * 10) / 10;
  }

  // ---- per class (always every class, so the comparison stays meaningful) ----
  const perClass = new Map();
  for (const row of classRows) {
    addCount(perClass, row.classId, row.status, row._count._all);
  }
  const classComparison = [...perClass.entries()]
    .map(([id, v]) => ({
      classId: id,
      className: classNameById.get(id) ?? id,
      rate: percent(v.attended, v.total),
    }))
    .sort((a, b) => a.className.localeCompare(b.className));

  // ---- students below the threshold ----
  const perStudent = new Map();
  for (const row of studentRows) {
    addCount(perStudent, row.studentId, row.status, row._count._all, {
      name: row.studentName,
      classId: row.classId,
    });
  }
  const studentsBelow80 = [...perStudent.entries()]
    .map(([studentId, v]) => ({
      studentId,
      name: v.name,
      className: classNameById.get(v.classId) ?? v.classId,
      rate: percent(v.attended, v.total),
      markedDays: v.total,
    }))
    .filter((s) => s.markedDays >= MIN_MARKED_DAYS && s.rate < THRESHOLD)
    .sort((a, b) => a.rate - b.rate)
    .slice(0, MAX_STUDENTS);

  return {
    days,
    from: isoDay(from),
    to: isoDay(to),
    classes: classes.map((c) => ({ id: c.classId, name: c.className })),
    latestDate: latest ? latest.date : null,
    todayAttendance: latest ? latest.rate : null,
    attendanceChange,
    daily,
    classComparison,
    studentsBelow80,
  };
};
