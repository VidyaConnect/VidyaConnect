import prisma from "../config/prisma.js";

const profileInclude = {
  school: true,
  teacher: {
    include: {
      classTeacherOf: {
        include: { _count: { select: { students: true } } },
      },
    },
  },
};

export const findProfileUserByKeycloakId = (keycloakId) =>
  prisma.user.findUnique({
    where: { keycloakId },
    include: profileInclude,
  });

export const countSchools = () => prisma.school.count();
