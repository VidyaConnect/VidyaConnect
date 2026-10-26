import * as repo from "../repositories/event.repository.js";
import { getUserClassIds } from "./audience.service.js";
import { getParentContext } from "../clients/schoolUser.client.js";
import { AppError } from "../utils/app-error.js";

export { AppError };

const SCHOOL_TYPES = ["holiday", "exam", "meeting", "event", "deadline", "trip"];
const PLATFORM_TYPES = ["holiday", "maintenance", "update", "training", "deadline", "event"];
const typesFor = (role) => (role === "ADMIN" ? PLATFORM_TYPES : SCHOOL_TYPES);

const KNOWN_ROLES = ["ADMIN", "SCHOOL_ADMIN", "TEACHER", "PARENT"];
const CAN_PUBLISH = ["ADMIN", "SCHOOL_ADMIN", "TEACHER"];

function assertKnownUser(user) {
  if (!KNOWN_ROLES.includes(user.role)) throw new AppError("Unknown role", 403);
  if (user.role !== "ADMIN" && !user.schoolId) {
    throw new AppError("Your account is not linked to a school", 403);
  }
}

function assertCanPublish(user) {
  assertKnownUser(user);
  if (!CAN_PUBLISH.includes(user.role)) {
    throw new AppError("You are not allowed to manage events", 403);
  }
}

function parseInput(input, role) {
  const title = input.title?.trim();
  if (!title) throw new AppError("Title is required");

  const type = input.type ?? "event";
  if (!typesFor(role).includes(type)) {
    throw new AppError("Invalid event type for your role");
  }

  const start = new Date(input.start);
  const end = new Date(input.end);
  if (isNaN(start) || isNaN(end)) throw new AppError("Valid start and end are required");
  if (end < start) throw new AppError("End must be after start");

  return {
    title,
    type,
    start,
    end,
    allDay: Boolean(input.allDay),
    description: input.description?.trim() || null,
    location: input.location?.trim() || null,
  };
}

// Decide WHO the event is for, based on the creator's role
async function resolveAudience(user, input) {
  if (user.role === "ADMIN") {
    return { scope: "PLATFORM", schoolId: null, classIds: [] };
  }

  if (user.role === "SCHOOL_ADMIN") {
    const classIds = input.classIds ?? [];
    return classIds.length
      ? { scope: "CLASS", schoolId: user.schoolId, classIds }
      : { scope: "SCHOOL", schoolId: user.schoolId, classIds: [] };
  }

  // TEACHER: only their own classes (default: all of them)
  const myClasses = await getUserClassIds(user);
  const classIds = input.classIds?.length ? input.classIds : myClasses;
  if (!classIds.length) throw new AppError("Select at least one class");
  if (classIds.some((id) => !myClasses.includes(id))) {
    throw new AppError("You can only publish to your own classes", 403);
  }
  return { scope: "CLASS", schoolId: user.schoolId, classIds };
}

function assertCanModify(user, event) {
  assertCanPublish(user);
  if (user.role === "ADMIN") {
    if (event.scope !== "PLATFORM") {
      throw new AppError("System admins can only manage platform events", 403);
    }
    return;
  }
  if (event.schoolId !== user.schoolId) {
    throw new AppError("You cannot modify this event", 403);
  }
  if (user.role === "TEACHER" && event.createdBy !== user.userId) {
    throw new AppError("Teachers can only modify their own events", 403);
  }
}

// A deadline is a single point in time, so it never counts as an overlap
async function findOverlapsFor(data, audience, excludeId) {
  if (data.type === "deadline") return [];
  return repo.findOverlapping({
    audience,
    start: data.start,
    end: data.end,
    excludeId,
  });
}

export async function listEvents(user, from, to) {
  // A parent's school comes from their linked children, not from the token
  if (user.role === "PARENT" && process.env.AUTH_DISABLED !== "true") {
    const ctx = await getParentContext(user);
    user = { ...user, schoolId: ctx?.schoolId ?? null };
  }

  assertKnownUser(user);
  const f = new Date(from);
  const t = new Date(to);
  if (isNaN(f) || isNaN(t)) throw new AppError("from and to must be valid dates");

  const needsClasses = ["TEACHER", "PARENT"].includes(user.role);
  const viewer = {
    role: user.role,
    userId: user.userId,
    schoolId: user.schoolId,
    classIds: needsClasses ? await getUserClassIds(user) : [],
  };
  return repo.findInRange({ viewer, from: f, to: t });
}

// "What already exists in this slot for the people I'm publishing to?"
export async function checkConflicts(user, input, excludeId) {
  assertCanPublish(user);
  const data = parseInput(input, user.role);
  const audience = await resolveAudience(user, input);
  return findOverlapsFor(data, audience, excludeId);
}

export async function createEvent(user, input, confirmOverlap = false) {
  assertCanPublish(user);
  const data = parseInput(input, user.role);
  const audience = await resolveAudience(user, input);

  const overlaps = await findOverlapsFor(data, audience);
  if (overlaps.length > 0 && !confirmOverlap) {
    throw new AppError("This time slot already has events", 409, { overlaps });
  }

  return repo.create({
    ...data,
    ...audience,
    createdBy: user.userId,
    createdByRole: user.role,
  });
}

export async function updateEvent(user, id, input, confirmOverlap = false) {
  const existing = await repo.findById(id);
  if (!existing) throw new AppError("Event not found", 404);
  assertCanModify(user, existing);

  const data = parseInput(input, user.role);
  const audience = await resolveAudience(user, input);

  const overlaps = await findOverlapsFor(data, audience, id);
  if (overlaps.length > 0 && !confirmOverlap) {
    throw new AppError("This time slot already has events", 409, { overlaps });
  }

  return repo.update(id, { ...data, ...audience });
}

export async function deleteEvent(user, id) {
  const existing = await repo.findById(id);
  if (!existing) throw new AppError("Event not found", 404);
  assertCanModify(user, existing);
  await repo.remove(id);
}