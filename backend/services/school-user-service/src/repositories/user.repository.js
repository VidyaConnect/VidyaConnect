import prisma from "../config/prisma.js";

export const findUserByKeycloakId = async (keycloakId, schoolId = undefined) => {
  return prisma.user.findFirst({
    where: {
      keycloakId,
      ...(schoolId && { schoolId }),
    },
    include: {
      school: true,
      student: true,
      teacher: true,
      parent: true,
    },
  });
};

export const findClassByTeacherId = async (teacherId) => {
  return prisma.class.findFirst({
    where: { classTeacherId: teacherId, isActive: true },
    orderBy: [{ academicYear: "desc" }, { className: "asc" }],
  });
};

export const findClassesByTeacherId = async (teacherId) => {
  return prisma.class.findMany({
    where: { classTeacherId: teacherId, isActive: true },
    orderBy: [{ academicYear: "desc" }, { className: "asc" }],
  });
};
