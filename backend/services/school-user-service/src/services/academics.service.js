import prisma from '../config/prisma.js';
import { httpError } from '../utils/httpError.js';
import { setKeycloakUserEnabled } from './keycloakClient.service.js';

const YEAR_RE = /^\d{4}$/;
const SECTION_RE = /^[A-Z0-9]{1,5}$/;
const LETTERS = 'ABCDEFGHIJ';
const MIN_GRADE = 1;
const MAX_GRADE = 13;

/* ----------------------------- helpers ----------------------------- */

function parseYear(value) {
  const year = String(value ?? new Date().getFullYear()).trim();
  if (!YEAR_RE.test(year)) throw httpError(400, 'Academic year must be a 4-digit year, for example 2026');
  return year;
}

function parseGrade(value) {
  const grade = Number(value);
  if (!Number.isInteger(grade) || grade < MIN_GRADE || grade > MAX_GRADE) {
    throw httpError(400, `Choose a grade from ${MIN_GRADE} to ${MAX_GRADE}`);
  }
  return grade;
}

const displayName = (grade, section) => (section ? `Grade ${grade}${section}` : `Grade ${grade}`);

/**
 * The DB stores only the section letter ("A"). The screen shows "Grade 1" when a grade
 * has one class and "Grade 6A" when it has several.
 */
function describeClasses(rows) {
  const perGrade = new Map();
  for (const c of rows) {
    const key = `${c.academicYear}|${parseInt(c.gradeLevel, 10)}`;
    perGrade.set(key, (perGrade.get(key) ?? 0) + 1);
  }
  return new Map(
    rows.map((c) => {
      const grade = parseInt(c.gradeLevel, 10);
      const section = perGrade.get(`${c.academicYear}|${grade}`) > 1 ? c.className : '';
      return [c.id, {
        id: c.id,
        className: displayName(grade, section),
        gradeLevel: grade,
        section,
        academicYear: Number(c.academicYear),
      }];
    }),
  );
}

const byGradeThenSection = (a, b) => a.gradeLevel - b.gradeLevel || a.section.localeCompare(b.section);

async function classLabel(cls) {
  const sameGrade = await prisma.class.count({
    where: { schoolId: cls.schoolId, academicYear: cls.academicYear, gradeLevel: cls.gradeLevel },
  });
  return displayName(parseInt(cls.gradeLevel, 10), sameGrade > 1 ? cls.className : '');
}

const isUniqueViolation = (err) => err?.code === 'P2002';

/* ------------------------------ reads ------------------------------ */

export async function listClasses(schoolId, academicYear) {
  const year = parseYear(academicYear);
  const rows = await prisma.class.findMany({
    where: { schoolId, academicYear: year },
    select: {
      id: true, gradeLevel: true, className: true, academicYear: true, classTeacherId: true,
      _count: { select: { students: true } },
    },
  });
  const info = describeClasses(rows);
  return rows
    .map((r) => ({ ...info.get(r.id), classTeacherId: r.classTeacherId, studentCount: r._count.students }))
    .sort(byGradeThenSection);
}

export async function listTeachers(schoolId) {
  const [classRows, teachers] = await Promise.all([
    prisma.class.findMany({
      where: { schoolId },
      select: { id: true, gradeLevel: true, className: true, academicYear: true },
    }),
    prisma.teacher.findMany({
      where: { schoolId, user: { isActive: true } },
      select: {
        id: true,
        teacherCode: true,
        user: { select: { fullName: true, email: true, phone: true } },
        classTeacherOf: { select: { id: true } },
        teaching: { select: { id: true, subject: true, classId: true } },
      },
    }),
  ]);
  const info = describeClasses(classRows);

  return teachers
    .map((t) => ({
      id: t.id,
      fullName: t.user.fullName,
      email: t.user.email,
      phone: t.user.phone ?? undefined,
      teacherCode: t.teacherCode ?? undefined,
      classTeacherOf: t.classTeacherOf ? info.get(t.classTeacherOf.id) ?? null : null,
      teaching: t.teaching
        .map((a) => ({
          id: a.id,
          subject: a.subject,
          classId: a.classId,
          className: info.get(a.classId)?.className ?? '',
        }))
        .sort((a, b) => a.subject.localeCompare(b.subject) || a.className.localeCompare(b.className)),
    }))
    .sort((a, b) => a.fullName.localeCompare(b.fullName));
}

/* ----------------------------- classes ----------------------------- */

export async function createClass(schoolId, { gradeLevel, section, academicYear }) {
  const grade = parseGrade(gradeLevel);
  const year = parseYear(academicYear);
  const sec = String(section ?? '').trim().toUpperCase();
  if (sec && !SECTION_RE.test(sec)) throw httpError(400, 'Section must be 1 to 5 letters or digits, for example A');

  const inGrade = await prisma.class.findMany({
    where: { schoolId, academicYear: year, gradeLevel: String(grade) },
    select: { className: true },
  });
  if (inGrade.length > 0 && !sec) {
    throw httpError(409, `Grade ${grade} already has a class, so the new one needs a section (A, B, C…)`);
  }
  if (inGrade.length >= LETTERS.length) throw httpError(409, `Grade ${grade} already has the maximum number of classes`);

  const name = sec || 'A';
  if (inGrade.some((c) => c.className.toUpperCase() === name)) {
    throw httpError(409, `${displayName(grade, name)} already exists`);
  }

  try {
    await prisma.class.create({
      data: { schoolId, academicYear: year, gradeLevel: String(grade), className: name },
    });
  } catch (err) {
    if (isUniqueViolation(err)) throw httpError(409, `${displayName(grade, name)} already exists`);
    throw err;
  }
}

/** First-time setup: count 1 gives "Grade 6", count 3 gives 6A, 6B, 6C. */
export async function createClasses(schoolId, { plan, academicYear }) {
  const year = parseYear(academicYear);
  if (!Array.isArray(plan) || plan.length === 0) throw httpError(400, 'Add at least one class');

  const data = [];
  const grades = new Set();
  for (const item of plan) {
    const grade = parseGrade(item?.gradeLevel);
    const count = Number(item?.count);
    if (!Number.isInteger(count) || count < 1 || count > LETTERS.length) {
      throw httpError(400, `Grade ${grade}: choose 1 to ${LETTERS.length} classes`);
    }
    if (grades.has(grade)) throw httpError(400, `Grade ${grade} appears twice`);
    grades.add(grade);
    for (let i = 0; i < count; i++) {
      data.push({ schoolId, academicYear: year, gradeLevel: String(grade), className: LETTERS[i] });
    }
  }

  const existing = await prisma.class.findFirst({
    where: { schoolId, academicYear: year, gradeLevel: { in: [...grades].map(String) } },
    select: { gradeLevel: true },
  });
  if (existing) throw httpError(409, `Grade ${parseInt(existing.gradeLevel, 10)} already has classes`);

  await prisma.class.createMany({ data, skipDuplicates: true });
}

export async function deleteClass(schoolId, classId) {
  const cls = await prisma.class.findFirst({
    where: { id: classId, schoolId },
    select: {
      id: true, schoolId: true, gradeLevel: true, className: true, academicYear: true,
      _count: { select: { students: true } },
    },
  });
  if (!cls) throw httpError(404, 'Class not found');
  if (cls._count.students > 0) {
    throw httpError(409, `${await classLabel(cls)} has ${cls._count.students} students. Move them to another class first.`);
  }
  await prisma.$transaction([
    prisma.teachingAssignment.deleteMany({ where: { classId } }),
    prisma.class.delete({ where: { id: classId } }),
  ]);
}

/**
 * Sets (or clears, with null) a class's class teacher. A teacher can lead only one class,
 * so a teacher who already led another class is moved.
 */
export async function setClassTeacher(schoolId, classId, teacherId) {
  const cls = await prisma.class.findFirst({ where: { id: classId, schoolId }, select: { id: true } });
  if (!cls) throw httpError(404, 'Class not found');

  if (teacherId == null) {
    await prisma.class.update({ where: { id: classId }, data: { classTeacherId: null } });
    return;
  }
  if (typeof teacherId !== 'string') throw httpError(400, 'Choose a teacher');

  const teacher = await prisma.teacher.findFirst({
    where: { id: teacherId, schoolId, user: { isActive: true } },
    select: { id: true },
  });
  if (!teacher) throw httpError(404, 'Teacher not found');

  try {
    await prisma.$transaction([
      prisma.class.updateMany({
        where: { schoolId, classTeacherId: teacherId, NOT: { id: classId } },
        data: { classTeacherId: null },
      }),
      prisma.class.update({ where: { id: classId }, data: { classTeacherId: teacherId } }),
    ]);
  } catch (err) {
    if (isUniqueViolation(err)) throw httpError(409, 'This class teacher was just changed by someone else. Refresh and try again.');
    throw err;
  }
}

/* ----------------------------- teaching ---------------------------- */

export async function addTeaching(schoolId, teacherId, { classId, subject }) {
  const sub = String(subject ?? '').trim();
  if (!sub || sub.length > 40) throw httpError(400, 'Choose a subject');
  if (typeof classId !== 'string') throw httpError(400, 'Choose a class');

  const [teacher, cls] = await Promise.all([
    prisma.teacher.findFirst({ where: { id: teacherId, schoolId, user: { isActive: true } }, select: { id: true } }),
    prisma.class.findFirst({
      where: { id: classId, schoolId },
      select: { id: true, schoolId: true, gradeLevel: true, className: true, academicYear: true },
    }),
  ]);
  if (!teacher) throw httpError(404, 'Teacher not found');
  if (!cls) throw httpError(404, 'Class not found');

  const existing = await prisma.teachingAssignment.findUnique({
    where: { classId_subject: { classId, subject: sub } },
    select: { teacherId: true, teacher: { select: { user: { select: { fullName: true } } } } },
  });
  if (existing) {
    const label = await classLabel(cls);
    throw httpError(
      409,
      existing.teacherId === teacherId
        ? `Already teaching ${sub} in ${label}`
        : `${label} ${sub} is already taught by ${existing.teacher.user.fullName}`,
    );
  }

  try {
    await prisma.teachingAssignment.create({ data: { teacherId, classId, subject: sub } });
  } catch (err) {
    if (isUniqueViolation(err)) throw httpError(409, `That subject is already assigned for this class`);
    throw err;
  }
}

export async function removeTeaching(schoolId, assignmentId) {
  const found = await prisma.teachingAssignment.findFirst({
    where: { id: assignmentId, teacher: { schoolId } },
    select: { id: true },
  });
  if (!found) throw httpError(404, 'Assignment not found');
  await prisma.teachingAssignment.delete({ where: { id: assignmentId } });
}

/* ----------------------------- teachers ---------------------------- */

/**
 * Removes a teacher from the school: the class they led becomes free, their subjects go,
 * and the account is disabled (database and Keycloak). The records are kept, not deleted.
 */
export async function removeTeacher(schoolId, teacherId) {
  const teacher = await prisma.teacher.findFirst({
    where: { id: teacherId, schoolId, user: { isActive: true } },
    select: { id: true, userId: true, user: { select: { keycloakId: true } } },
  });
  if (!teacher) throw httpError(404, 'Teacher not found');

  const { keycloakId } = teacher.user;
  await setKeycloakUserEnabled(keycloakId, false); // fails first, so nothing changes if Keycloak is down

  try {
    await prisma.$transaction([
      prisma.class.updateMany({ where: { schoolId, classTeacherId: teacherId }, data: { classTeacherId: null } }),
      prisma.teachingAssignment.deleteMany({ where: { teacherId } }),
      prisma.user.update({ where: { id: teacher.userId }, data: { isActive: false } }),
    ]);
  } catch (err) {
    await setKeycloakUserEnabled(keycloakId, true).catch(() => {}); // best-effort undo
    throw err;
  }
}