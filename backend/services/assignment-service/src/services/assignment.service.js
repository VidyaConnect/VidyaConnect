import { getTeacherClasses } from "../clients/schoolUser.client.js";
import * as repository from "../repositories/assignment.repository.js";

const httpError = (message, status) => Object.assign(new Error(message), { status });
const MAX_ATTACHMENTS = 10;
const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

async function getAssignedClasses(req) {
  const classes = await getTeacherClasses(req.user, req.headers.authorization);
  if (!classes.length || classes.some((klass) => !klass.classId || !klass.schoolId)) {
    throw httpError("Teacher has no assigned classes", 403);
  }
  return classes;
}

async function getAssignedClass(req, requestedClassId) {
  const classes = await getAssignedClasses(req);
  const classId = requestedClassId || (classes.length === 1 ? classes[0].classId : null);
  if (!classId) throw httpError("Choose one of your assigned classes", 400);
  const klass = classes.find((item) => item.classId === classId);
  if (!klass) throw httpError("Class is not assigned to this teacher", 403);
  return klass;
}

function validateAssignmentInput(input, { partial = false } = {}) {
  const fields = ["title", "description", "subject"];
  for (const field of fields) {
    if (!partial || hasOwn(input, field)) {
      if (typeof input[field] !== "string" || !input[field].trim()) {
        throw httpError(`${field[0].toUpperCase()}${field.slice(1)} is required`, 400);
      }
    }
  }

  for (const field of ["publishAt", "dueAt"]) {
    if (partial && !hasOwn(input, field)) continue;
    if (typeof input[field] !== "string" || Number.isNaN(new Date(input[field]).getTime())) {
      throw httpError(`${field === "dueAt" ? "Deadline" : "Publication date"} must be valid`, 400);
    }
  }

  const publishAt = hasOwn(input, "publishAt") ? new Date(input.publishAt) : null;
  const dueAt = hasOwn(input, "dueAt") ? new Date(input.dueAt) : null;
  if (publishAt && dueAt && dueAt <= publishAt) {
    throw httpError("The deadline must be after the publication date", 400);
  }

  if (hasOwn(input, "attachments")) {
    if (!Array.isArray(input.attachments) || input.attachments.length > MAX_ATTACHMENTS) {
      throw httpError(`Attachments must be an array of up to ${MAX_ATTACHMENTS} files`, 400);
    }
    const ids = new Set();
    for (const file of input.attachments) {
      if (!file || typeof file.fileId !== "string" || !file.fileId.trim() || typeof file.fileName !== "string" || !file.fileName.trim()) {
        throw httpError("Each attachment requires a file ID and file name", 400);
      }
      if (ids.has(file.fileId)) throw httpError("Duplicate attachments are not allowed", 400);
      ids.add(file.fileId);
    }
  }
}

async function loadClassRoster(req, klass) {
  const url = `${process.env.ATTENDANCE_SERVICE_URL || "http://attendance-service:3003"}/attendance/roster`;
  const rosterUrl = new URL(url);
  rosterUrl.searchParams.set("classId", klass.classId);
  let response;
  try {
    response = await fetch(rosterUrl, {
      headers: req.headers.authorization ? { Authorization: req.headers.authorization } : {},
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    throw httpError("Class roster service is unavailable; assignment was not saved", 503);
  }
  if (!response.ok) throw httpError("Could not load the assigned class roster; assignment was not saved", 502);

  const payload = await response.json();
  const roster = Array.isArray(payload) ? payload : payload?.data;
  if (!Array.isArray(roster)) throw httpError("Class roster response is invalid; assignment was not saved", 502);
  if (roster.some((student) => student.classId && student.classId !== klass.classId)) {
    throw httpError("Roster does not match the assigned class", 409);
  }

  return roster.map((student) => ({
    schoolId: klass.schoolId,
    studentId: student.id || student.studentId,
    studentName: student.name || student.studentName,
    rollNumber: student.rollNumber || student.rollNo || null,
    status: "PENDING",
  })).filter((student) => student.studentId && student.studentName);
}

export async function listAssignments(req) {
  const classes = await getAssignedClasses(req);
  const schoolId = classes[0].schoolId;
  if (classes.some((klass) => klass.schoolId !== schoolId)) {
    throw httpError("Teacher classes belong to different schools", 409);
  }
  return repository.listAssignments(schoolId, classes.map((klass) => klass.classId));
}

export async function getAssignment(req) {
  const classes = await getAssignedClasses(req);
  const assignment = await repository.findAssignment(classes[0].schoolId, req.params.assignmentId);
  if (!assignment || !classes.some((klass) => klass.classId === assignment.classId)) throw httpError("Assignment not found", 404);
  return assignment;
}

export async function createAssignment(req) {
  const klass = await getAssignedClass(req, req.body.classId);
  validateAssignmentInput(req.body);
  const { title, description, subject, dueAt, publishAt, attachments = [] } = req.body;
  const studentStatuses = await loadClassRoster(req, klass);

  return repository.createAssignment({
    schoolId: klass.schoolId,
    classId: klass.classId,
    className: klass.className,
    teacherId: req.user.userId,
    teacherName: req.user.fullName || "Teacher",
    title: title.trim(),
    description: description.trim(),
    subject: subject.trim(),
    dueAt: new Date(dueAt),
    publishAt: new Date(publishAt),
    publishedAt: null,
    status: "DRAFT",
    attachments: attachments.map(({ fileId, fileName }) => ({ fileId: fileId.trim(), fileName: fileName.trim() })),
    studentStatuses,
  });
}

export async function updateAssignment(req) {
  const assignment = await getAssignment(req);
  if (assignment.status !== "DRAFT") throw httpError("Only draft assignments can be edited", 409);
  validateAssignmentInput(req.body, { partial: true });

  const data = {};
  for (const field of ["title", "description", "subject"]) {
    if (hasOwn(req.body, field)) data[field] = req.body[field].trim();
  }
  for (const field of ["publishAt", "dueAt"]) {
    if (hasOwn(req.body, field)) data[field] = new Date(req.body[field]);
  }
  if (hasOwn(req.body, "attachments")) {
    data.attachments = req.body.attachments.map(({ fileId, fileName }) => ({ fileId: fileId.trim(), fileName: fileName.trim() }));
  }
  if (!Object.keys(data).length) throw httpError("Provide at least one assignment field to update", 400);
  if (data.dueAt && data.publishAt && data.dueAt <= data.publishAt) throw httpError("The deadline must be after the publication date", 400);

  const updated = await repository.updateDraft(assignment.schoolId, assignment.id, data);
  if (!updated) throw httpError("Draft assignment no longer exists", 404);
  return repository.findAssignment(assignment.schoolId, assignment.id);
}

export async function deleteAssignment(req) {
  const assignment = await getAssignment(req);
  if (assignment.status !== "DRAFT") throw httpError("Only draft assignments can be deleted", 409);
  const deleted = await repository.deleteDraft(assignment.schoolId, assignment.id);
  if (!deleted.count) throw httpError("Draft assignment no longer exists", 404);
  return { id: assignment.id, deleted: true };
}

export async function publishAssignment(req) {
  const assignment = await getAssignment(req);
  if (assignment.status === "PUBLISHED") throw httpError("Assignment is already published", 409);
  if (assignment.dueAt <= new Date()) throw httpError("The deadline must be in the future", 400);
  const publishedAt = assignment.publishAt > new Date() ? null : new Date();
  const result = await repository.updateAssignment(assignment.schoolId, assignment.id, {
    status: "PUBLISHED",
    publishedAt,
  });
  if (!result.count) throw httpError("Assignment not found", 404);
  return repository.findAssignment(assignment.schoolId, assignment.id);
}

export async function updateStudentStatus(req, studentId) {
  const assignment = await getAssignment(req);
  if (assignment.status !== "PUBLISHED" || !assignment.publishedAt || assignment.publishedAt > new Date()) {
    throw httpError("Assignment is not available for progress updates yet", 409);
  }
  const { status, marks, feedback } = req.body;
  if (!["PENDING", "COMPLETED", "MISSING"].includes(status)) throw httpError("Status must be PENDING, COMPLETED or MISSING", 400);
  if (marks != null && (!Number.isFinite(marks) || marks < 0 || marks > 100)) throw httpError("Marks must be between zero and 100", 400);
  if (feedback != null && typeof feedback !== "string") throw httpError("Feedback must be text", 400);
  if (marks != null && status !== "COMPLETED") throw httpError("Marks can only be recorded for completed work", 400);

  const result = await repository.updateStudentStatus(assignment.schoolId, assignment.id, studentId, {
    status,
    marks: status === "COMPLETED" ? marks ?? null : null,
    feedback: status === "COMPLETED" && typeof feedback === "string" ? feedback.trim() || null : null,
    markedAt: status === "PENDING" ? null : new Date(),
  });
  if (!result.count) throw httpError("Student is not on the assignment class roster", 404);
  return repository.findAssignment(assignment.schoolId, assignment.id);
}
