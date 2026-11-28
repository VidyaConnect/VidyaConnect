import prisma from "../lib/prisma.js";

const FORM_STATUSES = new Set(["DRAFT", "ACTIVE", "CLOSED"]);
const SCOPES = new Set(["CLASS", "SCHOOL"]);
const RESPONSE_STATUSES = new Set(["ACCEPTED", "DECLINED"]);

function fail(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function text(value, field, required = true) {
  if (value === undefined || value === null) {
    if (required) throw fail(`${field} is required`);
    return null;
  }
  const result = String(value).trim();
  if (required && !result) throw fail(`${field} is required`);
  return result || null;
}

function date(value, field) {
  const result = new Date(value);
  if (!value || Number.isNaN(result.getTime())) throw fail(`${field} must be a valid date`);
  return result;
}

async function resolveSchoolId(user) {
  if (!user?.userId) throw fail("Authenticated user is not associated with a school", 403);
  if (user.role === "TEACHER") {
    const [assignedClass] = await prisma.$queryRaw`
      SELECT c."schoolId"
      FROM school_user.classes c
      JOIN school_user.teachers t ON t.id = c."classTeacherId"
      JOIN school_user.users u ON u.id = t."userId"
      WHERE u."keycloakId" = ${user.userId}
        AND c."isActive" = true
      LIMIT 1
    `;
    if (assignedClass?.schoolId) return assignedClass.schoolId;
  }
  const [profile] = await prisma.$queryRaw`
    SELECT "schoolId"
    FROM school_user.users
    WHERE "keycloakId" = ${user.userId} AND "isActive" = true
    LIMIT 1
  `;
  if (profile?.schoolId) return profile.schoolId;
  if (user?.schoolId) return user.schoolId;
  throw fail("Authenticated user is not associated with a school", 403);
}

async function visibleWhere(user) {
  const schoolId = await resolveSchoolId(user);
  return user.role === "TEACHER"
    ? { schoolId, createdBy: user.userId }
    : { schoolId };
}

function mapForm(form) {
  const recipients = form.recipients || [];
  const accepted = recipients.filter((item) => item.status === "ACCEPTED").length;
  const declined = recipients.filter((item) => item.status === "DECLINED").length;
  return {
    id: form.id,
    title: form.title,
    description: form.description,
    instructions: form.instructions,
    audience: form.audience,
    classId: form.classId,
    scope: form.scope,
    status: form.status,
    schoolId: form.schoolId,
    creator: form.createdBy,
    createdAt: form.createdAt,
    publishedAt: form.publishedAt,
    deadline: form.deadline,
    closedAt: form.closedAt,
    recipients: recipients.length,
    accepted,
    declined,
    pending: recipients.length - accepted - declined,
  };
}

export async function listForms(user) {
  const forms = await prisma.consentForm.findMany({
    where: await visibleWhere(user),
    include: { recipients: true },
    orderBy: { createdAt: "desc" },
  });
  return forms.map(mapForm);
}

async function getFormRecord(id, user) {
  const form = await prisma.consentForm.findFirst({
    where: { id, ...(await visibleWhere(user)) },
    include: { recipients: true },
  });
  if (!form) throw fail("Consent form not found", 404);
  return form;
}

export async function getForm(id, user) {
  return mapForm(await getFormRecord(id, user));
}

export async function createForm(input, user) {
  const schoolId = await resolveSchoolId(user);
  const scope = String(input.scope || (user.role === "SCHOOL_ADMIN" ? "SCHOOL" : "CLASS")).toUpperCase();
  if (!SCOPES.has(scope)) throw fail("scope must be CLASS or SCHOOL");
  if (user.role === "TEACHER" && scope !== "CLASS") throw fail("Teachers may only create class-scoped forms", 403);
  if (user.role === "SCHOOL_ADMIN" && scope !== "SCHOOL") throw fail("School admins may only create school-scoped forms", 403);
  const deadline = date(input.deadline, "deadline");
  if (deadline <= new Date()) throw fail("deadline must be in the future");
  let classId = text(input.classId, "classId", false);
  let studentIds;
  if (scope === "CLASS") {
    if (!classId && user.role === "TEACHER") {
      const [assignedClass] = await prisma.$queryRaw`
        SELECT c.id, c."schoolId"
        FROM school_user.classes c
        JOIN school_user.teachers t ON t.id = c."classTeacherId"
        JOIN school_user.users u ON u.id = t."userId"
        WHERE u."keycloakId" = ${user.userId}
          AND c."isActive" = true
        LIMIT 1
      `;
      classId = assignedClass?.id || null;
    }
    if (!classId) throw fail("classId is required for a class-scoped form");
    const [targetClass] = await prisma.$queryRaw`
      SELECT c.id, c."schoolId", c."classTeacherId", u."keycloakId" AS "teacherKeycloakId"
      FROM school_user.classes c
      LEFT JOIN school_user.teachers t ON t.id = c."classTeacherId"
      LEFT JOIN school_user.users u ON u.id = t."userId"
      WHERE c.id = ${classId} AND c."schoolId" = ${schoolId} AND c."isActive" = true
      LIMIT 1
    `;
    if (!targetClass) throw fail("Class not found in your school", 404);
    if (user.role === "TEACHER" && targetClass.teacherKeycloakId !== user.userId) {
      throw fail("Teachers may only create forms for their assigned class", 403);
    }
    const students = await prisma.$queryRaw`SELECT id FROM school_user.students WHERE "schoolId" = ${schoolId} AND "classId" = ${classId} AND "isActive" = true`;
    studentIds = students.map((student) => student.id);
  } else {
    const students = await prisma.$queryRaw`SELECT id FROM school_user.students WHERE "schoolId" = ${schoolId} AND "isActive" = true`;
    studentIds = students.map((student) => student.id);
  }
  if (!studentIds.length) throw fail("The selected audience has no active students", 400);

  const form = await prisma.consentForm.create({
    data: {
      title: text(input.title, "title"),
      description: text(input.description, "description"),
      instructions: text(input.instructions, "instructions", false),
      audience: text(input.audience, "audience"),
      classId,
      scope,
      schoolId,
      createdBy: user.userId,
      deadline,
      recipients: {
        create: studentIds.map((studentId) => ({ studentId })),
      },
    },
    include: { recipients: true },
  });
  return mapForm(form);
}

export async function updateDraft(id, input, user) {
  const existing = await getFormRecord(id, user);
  if (existing.status !== "DRAFT") throw fail("Only draft forms can be edited", 409);
  const data = {};
  if ("title" in input) data.title = text(input.title, "title");
  if ("description" in input) data.description = text(input.description, "description");
  if ("instructions" in input) data.instructions = text(input.instructions, "instructions", false);
  if ("audience" in input) data.audience = text(input.audience, "audience");
  if ("deadline" in input) {
    data.deadline = date(input.deadline, "deadline");
    if (data.deadline <= new Date()) throw fail("deadline must be in the future");
  }
  if (!Object.keys(data).length) throw fail("No editable fields provided");
  const form = await prisma.consentForm.update({
    where: { id },
    data,
    include: { recipients: true },
  });
  return mapForm(form);
}

export async function publishForm(id, user) {
  const existing = await getFormRecord(id, user);
  if (existing.status !== "DRAFT") throw fail("Only draft forms can be published", 409);
  if (existing.deadline <= new Date()) throw fail("A form with a past deadline cannot be published");
  if (!existing.recipients.length) throw fail("A form must have recipients before it can be published");
  const form = await prisma.consentForm.update({
    where: { id },
    data: { status: "ACTIVE", publishedAt: new Date() },
    include: { recipients: true },
  });
  return mapForm(form);
}

export async function closeForm(id, user) {
  const existing = await getFormRecord(id, user);
  if (existing.status !== "ACTIVE") throw fail("Only active forms can be closed", 409);
  const form = await prisma.consentForm.update({
    where: { id },
    data: { status: "CLOSED", closedAt: new Date() },
    include: { recipients: true },
  });
  return mapForm(form);
}

export async function listResponses(id, user) {
  const form = await getFormRecord(id, user);
  return form.recipients;
}

export async function respondToForm(id, input, user) {
  if (user.role !== "PARENT") throw fail("Only parents can submit consent responses", 403);
  const status = String(input.status || "").toUpperCase();
  if (!RESPONSE_STATUSES.has(status)) throw fail("status must be ACCEPTED or DECLINED");
  const studentId = text(input.studentId, "studentId");
  const schoolId = await resolveSchoolId(user);
  const form = await prisma.consentForm.findFirst({ where: { id, schoolId, status: "ACTIVE" } });
  if (!form || form.deadline <= new Date()) throw fail("Consent form not found or its deadline has passed", 404);
  const recipient = await prisma.consentRecipient.findUnique({ where: { formId_studentId: { formId: id, studentId } } });
  if (!recipient) throw fail("Student is not a recipient of this consent form", 403);
  const [student] = await prisma.$queryRaw`SELECT s.id FROM school_user.students s JOIN school_user.parents p ON p.id = s."parentId" WHERE s.id = ${studentId} AND s."schoolId" = ${schoolId} AND p."userId" = ${user.userId}`;
  if (!student) throw fail("Student is not linked to the authenticated parent", 403);
  if (recipient.status) throw fail("A response has already been submitted for this student", 409);
  return prisma.consentRecipient.update({
    where: { id: recipient.id },
    data: { status, remarks: text(input.remarks, "remarks", false), respondedAt: new Date() },
  });
}
