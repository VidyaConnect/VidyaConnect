import prisma from '../config/prisma.js';
import { parseSpreadsheet } from '../utils/fileParser.js';
import { httpError } from '../utils/httpError.js';

const MAX_ROWS = 500;
const YEAR_RE = /^\d{4}$/;
const GRADE_RE = /^(?:[1-9]|1[0-3])$/;
const CLASS_RE = /^[A-Za-z0-9]{1,5}$/;

// If Class.gradeLevel is an Int in schema.prisma, change this to: (g) => Number(g)
const gradeValue = (g) => g;

// Headers may arrive as "Grade", "grade_level", "Class Name"... compare them in one simple form.
const simple = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
const GRADE_KEYS = ['grade', 'gradelevel'];
const CLASS_KEYS = ['class', 'classname', 'section'];

const pick = (data, keys) => {
  for (const k of Object.keys(data ?? {})) {
    if (keys.includes(simple(k))) return data[k];
  }
  return undefined;
};
const text = (v) => String(v ?? '').trim();
const cleanGrade = (v) => text(v).replace(/^grade\s*/i, '').replace(/\.0+$/, '');
const keyOf = (grade, name) => `${parseInt(grade, 10)}|${String(name).toLowerCase()}`;

export async function validateClasses({ schoolId, academicYear, buffer }) {
  const year = text(academicYear);
  if (!YEAR_RE.test(year)) throw httpError(400, 'Academic year must be a 4-digit year, for example 2026');

  const { headers, rows: parsed } = parseSpreadsheet(buffer);
  if (!parsed.length) throw httpError(400, 'The file has no data rows');
  if (parsed.length > MAX_ROWS) throw httpError(400, `A maximum of ${MAX_ROWS} rows is allowed per upload`);

  const present = headers.map(simple);
  const missing = [];
  if (!present.some((h) => GRADE_KEYS.includes(h))) missing.push('Grade');
  if (!present.some((h) => CLASS_KEYS.includes(h))) missing.push('Class');
  if (missing.length) throw httpError(400, `Missing required column(s): ${missing.join(', ')}`);

  // Include inactive classes too: the unique rule applies to them as well.
  const existing = await prisma.class.findMany({
    where: { schoolId, academicYear: year },
    select: { gradeLevel: true, className: true },
  });
  const taken = new Set(existing.map((c) => keyOf(c.gradeLevel, c.className)));
  const seen = new Map();

  const rows = [];
  const errors = [];
  const addError = (rowNumber, field, message) => errors.push({ rowNumber, field, message });

  for (const { rowNumber, data } of parsed) {
    const gradeLevel = cleanGrade(pick(data, GRADE_KEYS));
    const className = text(pick(data, CLASS_KEYS)).toUpperCase();
    if (!gradeLevel && !className) continue; // fully blank row

    rows.push({ rowNumber, values: { gradeLevel, className }, classId: null, generatedEmail: false });

    if (!GRADE_RE.test(gradeLevel)) { addError(rowNumber, 'grade_level', 'Grade must be a number from 1 to 13'); continue; }
    if (!CLASS_RE.test(className)) { addError(rowNumber, 'class_name', 'Class must be 1 to 5 letters or digits, for example A'); continue; }

    const key = keyOf(gradeLevel, className);
    if (seen.has(key)) { addError(rowNumber, 'class_name', `Duplicate of row ${seen.get(key)} in this file`); continue; }
    seen.set(key, rowNumber);
    if (taken.has(key)) addError(rowNumber, 'class_name', `Already exists for ${year}`);
  }

  if (!rows.length) throw httpError(400, 'The file has no data rows');

  const errorRows = new Set(errors.map((e) => e.rowNumber));
  errors.sort((a, b) => a.rowNumber - b.rowNumber);
  return {
    total: rows.length,
    rows,
    valid: rows.filter((r) => !errorRows.has(r.rowNumber)),
    errors,
    year,
  };
}

export async function commitClasses({ schoolId, academicYear, buffer, skipInvalid }) {
  // Re-validate on commit: never trust a preview that went through the client.
  const { total, rows, valid, errors, year } = await validateClasses({ schoolId, academicYear, buffer });
  if (errors.length && !skipInvalid) return { blocked: true, total, errors };

  const created = valid.length
    ? await prisma.class.createMany({
        data: valid.map((r) => ({
          schoolId,
          academicYear: year,
          gradeLevel: gradeValue(r.values.gradeLevel),
          className: r.values.className,
        })),
        skipDuplicates: true, // protects against two admins importing at once
      })
    : { count: 0 };

  const reasons = new Map();
  for (const e of errors) reasons.set(e.rowNumber, [reasons.get(e.rowNumber), e.message].filter(Boolean).join('; '));

  return {
    blocked: false,
    summary: { total, created: created.count, failed: 0, skipped: total - created.count },
    results: rows.map((r) => ({
      rowNumber: r.rowNumber,
      fullName: `Grade ${r.values.gradeLevel} ${r.values.className}`,
      email: '',
      status: reasons.has(r.rowNumber) ? 'failed' : 'created',
      error: reasons.get(r.rowNumber),
    })),
    skippedRows: errors,
  };
}