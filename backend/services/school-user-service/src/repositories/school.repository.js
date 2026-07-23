import prisma from "../config/prisma.js";

export const findSchoolById = async (schoolId) => {
  return prisma.school.findUnique({
    where: {
      id: schoolId,
    },
  });
};