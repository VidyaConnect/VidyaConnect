import { prisma } from "../config/prisma.js";

const db = () => prisma.calendarEvent;

// Events that touch the range [from, to]
const inRange = (from, to) => ({ start: { lte: to }, end: { gte: from } });

// Events a given viewer is allowed to see
function visibleTo(viewer) {
  if (viewer.role === "ADMIN") return { scope: "PLATFORM" }; // admin sees only platform events

  const platform = { scope: "PLATFORM" };
  const school = { scope: "SCHOOL", schoolId: viewer.schoolId };

  if (viewer.role === "SCHOOL_ADMIN") {
    // whole school: school-wide and class events
    return { OR: [platform, { schoolId: viewer.schoolId }] };
  }

  const classEvents = {
    scope: "CLASS",
    schoolId: viewer.schoolId,
    classIds: { hasSome: viewer.classIds ?? [] },
  };

  const or = [platform, school, classEvents];
  // teachers always see what they created themselves
  if (viewer.role === "TEACHER") or.push({ createdBy: viewer.userId });
  return { OR: or };
}

// Events that the people in "audience" can already see
function visibleToAudience(audience) {
  if (audience.scope === "PLATFORM") return { scope: "PLATFORM" };

  const platform = { scope: "PLATFORM" };

  if (audience.scope === "SCHOOL") {
    return { OR: [platform, { schoolId: audience.schoolId }] };
  }

  // CLASS
  return {
    OR: [
      platform,
      { scope: "SCHOOL", schoolId: audience.schoolId },
      {
        scope: "CLASS",
        schoolId: audience.schoolId,
        classIds: { hasSome: audience.classIds },
      },
    ],
  };
}

export function findInRange({ viewer, from, to }) {
  return db().findMany({
    where: { AND: [inRange(from, to), visibleTo(viewer)] },
    orderBy: { start: "asc" },
  });
}

export function findOverlapping({ audience, start, end, excludeId }) {
  return db().findMany({
    where: {
      AND: [
        { start: { lt: end }, end: { gt: start } }, // strict overlap
        { type: { not: "deadline" } }, // deadlines never block other events
        visibleToAudience(audience),
        ...(excludeId ? [{ id: { not: excludeId } }] : []),
      ],
    },
    orderBy: { start: "asc" },
  });
}

export function findById(id) {
  return db().findUnique({ where: { id } });
}

export function create(data) {
  return db().create({ data });
}

export function update(id, data) {
  return db().update({ where: { id }, data });
}

export function remove(id) {
  return db().delete({ where: { id } });
}