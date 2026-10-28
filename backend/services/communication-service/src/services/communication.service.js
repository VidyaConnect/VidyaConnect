import { prisma } from "../config/prisma.js";
import {
  getChildForParent,
  getStudentForTeacher,
  getUserByKeycloakId
} from "../clients/schoolUserClient.js";
import { httpError } from "../utils/httpError.js";

const MAX_BODY = 2000;
const MAX_FILES = 5;
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

// TODO: replace with the teacher's real availability and the school's time zone.
const AVAILABLE_FROM = 6;   // 6 am
const AVAILABLE_TO = 10;    // 10 am
const TIME_ZONE = "Asia/Colombo";

function availability() {
  // Use Sri Lanka time. A Docker container runs in UTC, which would be 5.5 hours off.
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: TIME_ZONE
    }).format(new Date())
  );
  return {
    availabilityLabel: "Available 6am - 10am",
    isTeacherAvailable: hour >= AVAILABLE_FROM && hour < AVAILABLE_TO
  };
}

function sizeLabel(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function toThread(convo, info) {
  return {
    id: convo.id,
    studentId: convo.studentId,
    studentName: info.studentName,
    parentName: info.parentName,
    teacherName: info.teacherName,
    className: info.className ? `Class Teacher ${info.className}` : "Class Teacher",
    ...availability()
  };
}

function toMessage(m, myUserId, otherReadAt) {
  const mine = m.senderUserId === myUserId;
  return {
    id: m.id,
    threadId: m.conversationId,
    senderRole: m.senderRole.toLowerCase(),
    senderName: m.senderName,
    body: m.body,
    sentAt: m.createdAt.toISOString(),
    status: mine && otherReadAt && otherReadAt >= m.createdAt ? "read" : "sent",
    attachments: m.attachments.map((a) => ({
      id: a.id,
      name: a.fileName,
      sizeLabel: sizeLabel(a.sizeBytes),
      mimeType: a.mimeType,
      fileId: a.fileId
    }))
  };
}

/** Loads a conversation only if the logged-in user is its parent or its teacher. */
async function getAccessibleConversation(user, threadId) {
  const me = await getUserByKeycloakId(user.userId);
  if (!me) throw httpError(403, "Account is not set up in the school system");

  const convo = await prisma.conversation.findUnique({ where: { id: threadId } });
  if (!convo) throw httpError(404, "Conversation not found");

  const isParent = user.role === "PARENT" && convo.parentUserId === me.id;
  const isTeacher = user.role === "TEACHER" && convo.teacherUserId === me.id;
  if (!isParent && !isTeacher) {
    throw httpError(403, "You do not have access to this conversation");
  }
  return { convo, me, otherUserId: isParent ? convo.teacherUserId : convo.parentUserId };
}

/** Finds the child's thread, or creates it on first use. */
export async function getOrCreateThread(user, studentId) {
  if (!studentId) throw httpError(400, "studentId is required");

  const info =
    user.role === "PARENT"
      ? await getChildForParent(user.userId, studentId)
      : await getStudentForTeacher(user.userId, studentId);

  if (!info) throw httpError(403, "You do not have access to this student's conversation");
  if (!info.teacherUserId || !info.parentUserId || !info.classId) {
    throw httpError(409, "This student has no class teacher or linked parent yet");
  }

  let convo = await prisma.conversation.findUnique({ where: { studentId } });
  if (!convo) {
    try {
      convo = await prisma.conversation.create({
        data: {
          schoolId: info.schoolId,
          classId: info.classId,
          studentId,
          teacherUserId: info.teacherUserId,
          parentUserId: info.parentUserId
        }
      });
    } catch (e) {
      if (e.code !== "P2002") throw e;
      convo = await prisma.conversation.findUnique({ where: { studentId } });
    }
  } else if (convo.teacherUserId !== info.teacherUserId) {
    // The class teacher changed: keep the history, point the thread at the new teacher.
    convo = await prisma.conversation.update({
      where: { id: convo.id },
      data: { teacherUserId: info.teacherUserId, classId: info.classId }
    });
  }
  return toThread(convo, info);
}

export async function listMessages(user, threadId) {
  const { convo, me, otherUserId } = await getAccessibleConversation(user, threadId);

  const [messages, otherRead] = await Promise.all([
    prisma.message.findMany({
      where: { conversationId: convo.id },
      orderBy: { createdAt: "asc" },
      include: { attachments: true }
    }),
    prisma.conversationRead.findUnique({
      where: { conversationId_userId: { conversationId: convo.id, userId: otherUserId } }
    })
  ]);

  return messages.map((m) => toMessage(m, me.id, otherRead?.lastReadAt ?? null));
}

export async function sendMessage(user, threadId, payload) {
  const { convo, me } = await getAccessibleConversation(user, threadId);

  const body = typeof payload?.body === "string" ? payload.body.trim() : "";
  const files = Array.isArray(payload?.attachments) ? payload.attachments : [];

  if (!body && files.length === 0) throw httpError(400, "A message needs text or a file");
  if (body.length > MAX_BODY) throw httpError(400, `Message is longer than ${MAX_BODY} characters`);
  if (files.length > MAX_FILES) throw httpError(400, `You can attach up to ${MAX_FILES} files`);

  for (const f of files) {
    if (!f?.fileId || !f?.fileName) throw httpError(400, "Each attachment needs fileId and fileName");
    if (!ALLOWED_TYPES.includes(f.mimeType)) throw httpError(400, `${f.fileName}: file type is not allowed`);
    if (!Number.isInteger(f.sizeBytes) || f.sizeBytes <= 0 || f.sizeBytes > MAX_BYTES) {
      throw httpError(400, `${f.fileName}: file must be 10 MB or smaller`);
    }
  }

  // The server decides the sender, role, id and time. Nothing here is edited or deleted later.
  const saved = await prisma.message.create({
    data: {
      conversationId: convo.id,
      senderUserId: me.id,
      senderName: me.fullName,
      senderRole: user.role,
      body,
      attachments: {
        create: files.map((f) => ({
          fileId: f.fileId,
          fileName: f.fileName,
          mimeType: f.mimeType,
          sizeBytes: f.sizeBytes
        }))
      }
    },
    include: { attachments: true }
  });

  // Sending counts as reading the thread.
  await prisma.conversationRead.upsert({
    where: { conversationId_userId: { conversationId: convo.id, userId: me.id } },
    create: { conversationId: convo.id, userId: me.id },
    update: { lastReadAt: new Date() }
  });

  const result = toMessage(saved, me.id, null);
  if (user.role === "PARENT" && !availability().isTeacherAvailable) {
    result.deliveryNote = "Teacher is unavailable. Message will be delivered later.";
  }
  return result;
}

export async function markRead(user, threadId) {
  const { convo, me } = await getAccessibleConversation(user, threadId);
  await prisma.conversationRead.upsert({
    where: { conversationId_userId: { conversationId: convo.id, userId: me.id } },
    create: { conversationId: convo.id, userId: me.id },
    update: { lastReadAt: new Date() }
  });
  return { threadId: convo.id, read: true };
}