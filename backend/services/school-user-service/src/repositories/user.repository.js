import prisma from "../config/prisma.js";

export const findUserByKeycloakId = async (keycloakId, schoolId) => {
  return prisma.user.findFirst({
    where: {
      keycloakId,
      schoolId,
    },
    include: {
      school: true,
      student: true,
      teacher: true,
      parent: true,
    },
  });
};