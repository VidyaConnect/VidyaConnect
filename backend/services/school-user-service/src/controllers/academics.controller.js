import * as service from '../services/academics.service.js';

// requireSchoolAdmin sets req.schoolAdmin. The school never comes from the request.
const schoolOf = (req) => req.schoolAdmin.schoolId;

const handle = (fn) => async (req, res, next) => {
  try {
    await fn(req, res);
  } catch (err) {
    next(err);
  }
};

const done = (res) => res.json({ ok: true });

export const listTeachers = handle(async (req, res) => res.json(await service.listTeachers(schoolOf(req))));

export const listClasses = handle(async (req, res) =>
  res.json(await service.listClasses(schoolOf(req), req.query.academicYear)));

export const createClass = handle(async (req, res) => {
  await service.createClass(schoolOf(req), req.body ?? {});
  done(res);
});

export const createClasses = handle(async (req, res) => {
  await service.createClasses(schoolOf(req), req.body ?? {});
  done(res);
});

export const deleteClass = handle(async (req, res) => {
  await service.deleteClass(schoolOf(req), req.params.classId);
  done(res);
});

export const setClassTeacher = handle(async (req, res) => {
  await service.setClassTeacher(schoolOf(req), req.params.classId, req.body?.teacherId ?? null);
  done(res);
});

export const addTeaching = handle(async (req, res) => {
  await service.addTeaching(schoolOf(req), req.params.teacherId, req.body ?? {});
  done(res);
});

export const removeTeaching = handle(async (req, res) => {
  await service.removeTeaching(schoolOf(req), req.params.assignmentId);
  done(res);
});

export const removeTeacher = handle(async (req, res) => {
  await service.removeTeacher(schoolOf(req), req.params.teacherId);
  done(res);
});