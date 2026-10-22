import { getTeacherClass } from "../clients/schoolUser.client.js";
import * as repository from "../repositories/assignment.repository.js";

const httpError = (message, status) => Object.assign(new Error(message), { status });

export async function listAssignments(req) {
  const klass = await getTeacherClass(req.user, req.headers.authorization);
  if (!klass?.classId || !klass?.schoolId) throw httpError("Teacher has no assigned class", 403);
  return repository.listAssignments(klass.schoolId, klass.classId);
}

export async function getAssignment(req) {
  const klass = await getTeacherClass(req.user, req.headers.authorization);
  if (!klass?.classId || !klass?.schoolId) throw httpError("Teacher has no assigned class", 403);
  const assignment = await repository.findAssignment(klass.schoolId, req.params.assignmentId);
  if (!assignment || assignment.classId !== klass.classId) throw httpError("Assignment not found", 404);
  return assignment;
}

export async function createAssignment(req) {
  const klass = await getTeacherClass(req.user, req.headers.authorization);
  if (!klass?.classId || !klass?.schoolId) throw httpError("Teacher has no assigned class", 403);
  const { title, description, subject, dueAt, publishAt, attachments = [] } = req.body;
  if (!title?.trim() || !description?.trim() || !subject?.trim()) throw httpError("Title, instructions and subject are required", 400);
  if (!dueAt || !publishAt || Number.isNaN(new Date(dueAt).getTime()) || Number.isNaN(new Date(publishAt).getTime())) throw httpError("Publication and due dates must be valid", 400);
  if (new Date(dueAt) <= new Date(publishAt)) throw httpError("The deadline must be after the publication date", 400);

  if (!Array.isArray(attachments) || attachments.length > 10 || attachments.some((file) => typeof file.fileId !== "string" || typeof file.fileName !== "string")) throw httpError("Attachments must include valid file IDs and names (up to 10 files)", 400);

  const attendanceUrl = `${process.env.ATTENDANCE_SERVICE_URL || "http://attendance-service:3003"}/attendance/roster`;
  const response = await fetch(attendanceUrl, { headers: req.headers.authorization ? { Authorization: req.headers.authorization } : {} });
  if (!response.ok) throw httpError("Could not load the assigned class roster", 502);
  const roster = await response.json();
  if (klass.classId && roster.length && roster.some((student) => student.classId && student.classId !== klass.classId)) throw httpError("Roster does not match the assigned class", 409);
  const students = Array.isArray(roster) ? roster : roster.data || [];

  return repository.createAssignment({
    schoolId: klass.schoolId, classId: klass.classId, className: klass.className,
    teacherId: req.user.userId, teacherName: req.user.fullName || "Teacher",
    title: title.trim(), description: description.trim(), subject: subject.trim(),
    dueAt: new Date(dueAt), publishAt: new Date(publishAt), publishedAt: null, status: "DRAFT",
    attachments: attachments.map(({ fileId, fileName }) => ({ fileId, fileName })),
    studentStatuses: students.map((student) => ({
      schoolId: klass.schoolId, studentId: student.id || student.studentId,
      studentName: student.name || student.studentName || "Student",
      rollNumber: student.rollNumber || student.rollNo || null, status: "PENDING",
    })).filter((student) => student.studentId),
  });
}
export async function publishAssignment(req) {
  const assignment = await getAssignment(req);
  if (assignment.status === "PUBLISHED") throw httpError("Assignment is already published", 409);
  if (assignment.dueAt <= new Date()) throw httpError("The deadline must be in the future", 400);
  const result = await repository.updateAssignment(assignment.schoolId, assignment.id, { status: "PUBLISHED", publishedAt: new Date() });
  if (!result.count) throw httpError("Assignment not found", 404);
  return repository.findAssignment(assignment.schoolId, assignment.id);
}

export async function updateStudentStatus(req, studentId) {
  const assignment = await getAssignment(req);
  if (assignment.status !== "PUBLISHED") throw httpError("Publish the assignment before updating student progress", 409);
  const { status, marks, feedback } = req.body;
  if (!["PENDING", "COMPLETED", "MISSING"].includes(status)) throw httpError("Status must be PENDING, COMPLETED or MISSING", 400);
  if (marks != null && (!Number.isFinite(marks) || marks < 0 || marks > 100)) throw httpError("Marks must be between zero and 100", 400);
  const result = await repository.updateStudentStatus(assignment.schoolId, assignment.id, studentId, {
    status, marks: marks ?? null, feedback: typeof feedback === "string" ? feedback.trim() || null : null,
    markedAt: status === "PENDING" ? null : new Date(),
  });
  if (!result.count) throw httpError("Student is not on the assignment class roster", 404);
  return repository.findAssignment(assignment.schoolId, assignment.id);
}


