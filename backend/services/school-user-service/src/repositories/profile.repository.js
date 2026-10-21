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
  prisma.user.findUnique({ where: { keycloakId }, include: profileInclude });

export const updateUserProfile = (keycloakId, data) =>
  prisma.user.update({ where: { keycloakId }, data, include: profileInclude });

export const countSchools = () => prisma.school.count();

export const findUserByEmail = (email) => prisma.user.findUnique({ where: { email } });
