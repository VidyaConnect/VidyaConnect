import crypto from 'node:crypto';
import prisma from '../config/prisma.js';                       // ADAPT: how your prisma client is exported
import {
  createKeycloakUser,
  deleteKeycloakUser,
  assignRealmRole,
} from './keycloakClient.service.js';
import { parseSpreadsheet } from '../utils/fileParser.js';
import { BULK_TYPES } from '../utils/bulkValidation.js';
import { httpError } from '../utils/httpError.js';              // ADAPT: httpError(status, message)

const MAX_ROWS = 500;
const CONCURRENCY = 5;

const classKey = (grade, name) =>
  `${parseInt(grade, 10)}|${String(name).toLowerCase().replace(/^grade\s*\d+\s*/, '').replace(/\s+/g, '')}`;
/* ----------------------------- helpers ----------------------------- */

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return results;
}

function flagDuplicates(prepared, getKey, field, message, addError) {
  const seen = new Map();
  for (const row of prepared) {
    const key = getKey(row.values);
    if (!key) continue;
    if (seen.has(key)) addError(row.rowNumber, field, `${message} (first used on row ${seen.get(key)})`);
    else seen.set(key, row.rowNumber);
  }
}

const generateTempPassword = () =>
  `${crypto.randomBytes(8).toString('base64url')}Aa1!`; // satisfies typical Keycloak policies

// Students without an email get a placeholder so User.email (required + unique) is satisfied.
const placeholderEmail = (schoolId, admissionNumber) =>
  `${admissionNumber.toLowerCase().replace(/[^a-z0-9]/g, '')}@s${schoolId.slice(0, 8)}.vidyaconnect.local`;

function toMessage(err) {
  if (err.code === 'P2002') return 'Email, teacher code or admission number already exists';
  return err.message || 'Unexpected error';
}

async function loadClassMap(schoolId, academicYear) {
  const classes = await prisma.class.findMany({
    where: { schoolId, academicYear, isActive: true },
    select: { id: true, gradeLevel: true, className: true, classTeacherId: true },
  });
  return new Map(classes.map((c) => [classKey(c.gradeLevel, c.className), c]));
}

/* --------------------------- validation ---------------------------- */

async function checkEmails(prepared, addError) {
  flagDuplicates(prepared, (v) => v.email, 'email', 'Duplicate email in file', addError);
  const emails = prepared.map((r) => r.values.email).filter(Boolean);
  if (!emails.length) return;

  const existing = await prisma.user.findMany({
    where: { email: { in: emails } },
    select: { email: true },
  });
  const taken = new Set(existing.map((u) => u.email.toLowerCase()));
  for (const row of prepared) {
    if (taken.has(row.values.email)) addError(row.rowNumber, 'email', 'Email is already registered');
  }
}

async function checkTeachers(prepared, schoolId, classMap, addError) {
  await checkEmails(prepared, addError);

  flagDuplicates(prepared, (v) => v.teacherCode, 'teacher_code', 'Duplicate teacher code in file', addError);
  const codes = prepared.map((r) => r.values.teacherCode).filter(Boolean);
  if (codes.length) {
    const existing = await prisma.teacher.findMany({
      where: { schoolId, teacherCode: { in: codes } },
      select: { teacherCode: true },
    });
    const taken = new Set(existing.map((t) => t.teacherCode));
    for (const row of prepared) {
      if (taken.has(row.values.teacherCode)) addError(row.rowNumber, 'teacher_code', 'Teacher code already exists');
    }
  }

  flagDuplicates(
    prepared,
    (v) => v.className && classKey(v.gradeLevel, v.className),
    'class_name',
    'Another teacher in this file has the same class',
    addError,
  );

  for (const row of prepared) {
    const { gradeLevel, className } = row.values;
    if (!gradeLevel || !className) continue; // subject teacher: no class
    const cls = classMap.get(classKey(gradeLevel, className));
    if (!cls) addError(row.rowNumber, 'class_name', `Class ${gradeLevel} ${className} not found for this academic year`);
    else if (cls.classTeacherId) addError(row.rowNumber, 'class_name', `Class ${gradeLevel} ${className} already has a class teacher`);
    else row.classId = cls.id;
  }
}

async function checkStudents(prepared, schoolId, classMap, addError) {
  await checkEmails(prepared, addError);
  flagDuplicates(prepared, (v) => v.admissionNumber, 'admission_number', 'Duplicate admission number in file', addError);

  const numbers = prepared.map((r) => r.values.admissionNumber).filter(Boolean);
  if (numbers.length) {
    const existing = await prisma.student.findMany({
      where: { schoolId, admissionNumber: { in: numbers } }, // needs the per-school unique from the schema change
      select: { admissionNumber: true },
    });
    const taken = new Set(existing.map((s) => s.admissionNumber));
    for (const row of prepared) {
      if (taken.has(row.values.admissionNumber)) addError(row.rowNumber, 'admission_number', 'Admission number already exists');
    }
  }

  for (const row of prepared) {
    const { gradeLevel, className } = row.values;
    if (!gradeLevel || !className) continue; // already reported as Required
    const cls = classMap.get(classKey(gradeLevel, className));
    if (!cls) addError(row.rowNumber, 'class_name', `Class ${gradeLevel} ${className} not found for this academic year`);
    else row.classId = cls.id;
  }
}

export async function validateFile({ type, schoolId, academicYear, buffer }) {
  const config = BULK_TYPES[type];
  if (!config) throw httpError(400, 'Unknown registration type');

  const { headers, rows } = parseSpreadsheet(buffer);
  if (rows.length === 0) throw httpError(400, 'The file has no data rows');
  if (rows.length > MAX_ROWS) throw httpError(400, `A maximum of ${MAX_ROWS} rows is allowed per upload`);

  const missing = config.required.filter((c) => !headers.includes(c));
  if (missing.length) throw httpError(400, `Missing required column(s): ${missing.join(', ')}`);

  const errors = [];
  const addError = (rowNumber, field, message) => errors.push({ rowNumber, field, message });

  const prepared = rows.map(({ rowNumber, data }) => {
    const { values, errors: rowErrors } = config.prepareRow(data);
    rowErrors.forEach((e) => addError(rowNumber, e.field, e.message));
    return { rowNumber, values, classId: null, generatedEmail: false };
  });

  const needsClasses = type === 'students' || prepared.some((r) => r.values.className);
  let classMap = new Map();
  if (needsClasses) {
    if (!academicYear) throw httpError(400, 'academicYear is required');
    classMap = await loadClassMap(schoolId, academicYear);
  }

  if (type === 'students') {
    for (const row of prepared) {
      if (!row.values.email && row.values.admissionNumber) {
        row.values.email = placeholderEmail(schoolId, row.values.admissionNumber);
        row.generatedEmail = true;
      }
    }
    await checkStudents(prepared, schoolId, classMap, addError);
  } else {
    await checkTeachers(prepared, schoolId, classMap, addError);
  }

  const errorRows = new Set(errors.map((e) => e.rowNumber));
  errors.sort((a, b) => a.rowNumber - b.rowNumber);
  return {
    total: prepared.length,
    rows: prepared,
    valid: prepared.filter((r) => !errorRows.has(r.rowNumber)),
    errors,
  };
}

/* ---------------------------- creating ----------------------------- */

// Teachers: Keycloak user + role first, then the DB in one transaction; undo Keycloak if anything after it fails.
// Students: internal records only (no login), so Keycloak is skipped.
// false = the teacher can sign in with the temporary password right away (the app logs in
// with Keycloak's direct-grant flow, which rejects accounts with a pending password change).
const TEMP_PASSWORD_MUST_CHANGE = false;

async function createAccount({ role, schoolId, values, createProfile, withLogin = true }) {
  const tempPassword = withLogin ? generateTempPassword() : null;
  const keycloakId = withLogin
    ? await createKeycloakUser({
        email: values.email,
        password: tempPassword,
        fullName: values.fullName,
        temporary: TEMP_PASSWORD_MUST_CHANGE,
        attributes: { school_id: [schoolId] },
      })
    : `internal-${crypto.randomUUID()}`;     // User.keycloakId is required and unique

  try {
    if (withLogin) {
      await assignRealmRole(keycloakId, role); 
    }
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          keycloakId,
          schoolId,
          fullName: values.fullName,
          email: values.email,
          phone: values.phone || null,
          role,
        },
      });
      await createProfile(tx, user);
    });
  } catch (err) {
    if (withLogin) {
      await deleteKeycloakUser(keycloakId); // logs its own errors
    }
    throw err;
  }
  return tempPassword;
}

// Also usable by a single "add teacher" endpoint: registerTeacher(schoolId, { values, classId })
export function registerTeacher(schoolId, { values, classId }) {
  return createAccount({
    role: 'TEACHER',
    schoolId,
    values,
    createProfile: async (tx, user) => {
      const teacher = await tx.teacher.create({
        data: { userId: user.id, schoolId, teacherCode: values.teacherCode || null },
      });
      if (classId) {
        // Conditional update also protects against two admins assigning the same class at once.
        const res = await tx.class.updateMany({
          where: { id: classId, schoolId, classTeacherId: null },
          data: { classTeacherId: teacher.id },
        });
        if (res.count === 0) throw httpError(409, 'Class already has a class teacher');
      }
    },
  });
}

export function registerStudent(schoolId, { values, classId }) {
  return createAccount({
    role: 'STUDENT',
    schoolId,
    values,
    withLogin: false,
    createProfile: (tx, user) =>
      tx.student.create({
        data: {
          userId: user.id,
          schoolId,
          classId,
          admissionNumber: values.admissionNumber,
          dateOfBirth: values.dateOfBirth ? new Date(`${values.dateOfBirth}T00:00:00Z`) : null,
          gender: values.gender || null,
        },
      }),
  });
}

export async function commitFile({ type, schoolId, academicYear, buffer, skipInvalid }) {
  // Re-validate on commit: never trust a preview that went through the client.
  const { total, valid, errors } = await validateFile({ type, schoolId, academicYear, buffer });
  if (errors.length && !skipInvalid) return { blocked: true, total, errors };

  const register = type === 'teachers' ? registerTeacher : registerStudent;
  const results = await mapLimit(valid, CONCURRENCY, async (row) => {
    const base = { rowNumber: row.rowNumber, fullName: row.values.fullName, email: row.values.email };
    try {
      const tempPassword = await register(schoolId, row);
      return { ...base, status: 'created', tempPassword };
    } catch (err) {
      return { ...base, status: 'failed', error: toMessage(err) };
    }
  });

  return {
    blocked: false,
    summary: {
      total,
      created: results.filter((r) => r.status === 'created').length,
      failed: results.filter((r) => r.status === 'failed').length,
      skipped: errors.length,
    },
    results,
    skippedRows: errors,
  };
}