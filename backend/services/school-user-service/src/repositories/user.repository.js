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

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

export const createParentUser = async ({ keycloakId, fullName, email, phone }) => {
  // Nested create: the User and the Parent row are saved together in one transaction
  return prisma.user.create({
    data: {
      keycloakId,
      fullName,
      email,
      phone,
      role: 'PARENT', // always set on the server, never taken from the request
      parent: { create: {} },
    },
  });
};

export const createSchoolAdminUser = async ({ keycloakId, fullName, email, phone }) => {
  return prisma.user.create({
    data: {
      keycloakId,
      fullName,
      email,
      phone,
      role: 'SCHOOL_ADMIN', // always set on the server, never taken from the request
    },
  });
};