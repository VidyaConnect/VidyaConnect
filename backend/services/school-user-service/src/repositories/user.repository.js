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
  return prisma.class.findUnique({ where: { classTeacherId: teacherId } });
};