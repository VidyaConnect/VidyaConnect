import { BULK_TYPES } from '../utils/bulkValidation.js';
import * as service from '../services/bulkRegistration.service.js';
import * as classService from '../services/classBulk.service.js';
import { httpError } from '../utils/httpError.js';
import prisma from '../config/prisma.js';

const CLASS_TYPE = 'classes';

function getContext(req) {
  const type = req.params.type;
  if (type !== CLASS_TYPE && !BULK_TYPES[type]) throw httpError(404, 'Unknown registration type');
  // The school ALWAYS comes from the logged-in admin (set by requireSchoolAdmin), never from the file or body.
  const schoolId = req.schoolAdmin?.schoolId ?? req.user?.schoolId;
  if (!schoolId) throw httpError(403, 'No school linked to this account');
  return { type, schoolId };
}

function getFile(req) {
  if (!req.file) throw httpError(400, 'Upload a .csv or .xlsx file in the "file" field');
  return req.file.buffer;
}

export function downloadTemplate(req, res, next) {
  try {
    const type = req.params.type;
    let csv;
    if (type === CLASS_TYPE) {
      csv = 'Grade,Class\n5,A';
    } else {
      const config = BULK_TYPES[type];
      if (!config) throw httpError(404, 'Unknown registration type');
      csv = [config.columns.join(','), config.example.join(',')].join('\n');
    }
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${type}-template.csv"`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
}

export async function validate(req, res, next) {
  try {
    const { type, schoolId } = getContext(req);
    const run = type === CLASS_TYPE ? classService.validateClasses : service.validateFile;
    const { total, rows, valid, errors } = await run({
      type,
      schoolId,
      academicYear: req.body.academicYear,
      buffer: getFile(req),
    });
    res.json({
      total,
      validCount: valid.length,
      errorCount: new Set(errors.map((e) => e.rowNumber)).size,
      rows: rows.map(({ rowNumber, values, classId, generatedEmail }) => ({
        rowNumber, ...values, classId, generatedEmail,
      })),
      errors,
    });
  } catch (err) {
    next(err);
  }
}

export async function commit(req, res, next) {
  try {
    const { type, schoolId } = getContext(req);
    const run = type === CLASS_TYPE ? classService.commitClasses : service.commitFile;
    const result = await run({
      type,
      schoolId,
      academicYear: req.body.academicYear,
      buffer: getFile(req),
      skipInvalid: req.body.skipInvalid === 'true',
    });
    if (result.blocked) {
      return res.status(422).json({
        message: 'The file has errors. Fix them, or confirm to skip the invalid rows.',
        total: result.total,
        errors: result.errors,
      });
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function status(req, res, next) {
  try {
    const schoolId = req.schoolAdmin?.schoolId;
    if (!schoolId) throw httpError(403, 'No school linked to this account');

    const year = String(req.query.academicYear ?? '').trim();
    if (!/^\d{4}$/.test(year)) throw httpError(400, 'academicYear must be a 4-digit year');

    const classes = await prisma.class.findMany({
      where: { schoolId, academicYear: year, isActive: true },
      select: { id: true },
    });
    const [teachers, students] = await Promise.all([
      prisma.teacher.count({ where: { schoolId } }),
      classes.length
        ? prisma.student.count({ where: { schoolId, classId: { in: classes.map((c) => c.id) } } })
        : 0,
    ]);

    res.json({ classes: classes.length, teachers, students });
  } catch (err) {
    next(err);
  }
}