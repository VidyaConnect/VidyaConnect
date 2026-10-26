import prisma from "../config/prisma.js";
import {
  findUserByKeycloakId,
  findClassByTeacherId,
} from "../repositories/user.repository.js";

export const getCurrentUserProfile = async (keycloakId) => {
  const user = await findUserByKeycloakId(keycloakId);

  if (!user) {
    throw new Error("User profile not found");
  }

  return user;
};

export async function getTeacherClass(keycloakId) {
  const user = await findUserByKeycloakId(keycloakId);
  if (!user || !user.teacher) {
    const error = new Error("Teacher profile not found");
    error.status = 404;
    throw error;
  }

  const cls = await findClassByTeacherId(user.teacher.id);
  if (!cls) {
    const error = new Error("No class assigned to this teacher");
    error.status = 404;
    throw error;
  }

  return { schoolId: cls.schoolId, classId: cls.id, className: cls.className };
}

// A parent's school and classes come from their linked children
// (a student is "linked" once the class teacher approved the request,
// which sets Student.parentId).
export async function getParentChildrenClasses(keycloakId) {
  const students = await prisma.student.findMany({
    where: { isActive: true, parent: { user: { keycloakId } } },
    orderBy: { createdAt: "asc" },
    select: { id: true, schoolId: true, classId: true },
  });

  if (students.length === 0) {
    return { schoolId: null, classIds: [], children: [] };
  }

  // The calendar works with one school per user, so use the first child's
  // school and only that school's classes.
  const schoolId = students[0].schoolId;
  const inSchool = students.filter((s) => s.schoolId === schoolId);
  const classIds = [...new Set(inSchool.map((s) => s.classId).filter(Boolean))];

  return {
    schoolId,
    classIds,
    children: inSchool.map((s) => ({ studentId: s.id, classId: s.classId })),
  };
}