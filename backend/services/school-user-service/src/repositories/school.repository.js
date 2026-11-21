import prisma from "../config/prisma.js";

export const findSchoolById = async (schoolId) => {
  return prisma.school.findUnique({ where: { id: schoolId } });
};

export const findSchoolByEmail = async (email) => {
  return prisma.school.findUnique({ where: { email } });
};

export const findSchoolByCensusNumber = async (censusNumber) => {
  return prisma.school.findUnique({ where: { censusNumber } });
};

/**
 * Creates the school and links the logged-in School Admin to it
 * in one step. If one part fails, nothing is saved.
 */
export const createSchoolRegistration = async (data, adminUserId) => {
  return prisma.school.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      censusNumber: data.censusNumber,
      schoolType: data.schoolType,
      principalName: data.principalName,
      region: data.region,
      district: data.district,
      studentCount: data.studentCount,
      teacherCount: data.teacherCount,
      verificationDocUrl: data.verificationDocUrl,
      adminEmail: data.adminEmail,
      adminFirstName: data.adminFirstName,
      adminLastName: data.adminLastName,
      status: "UNDER_REVIEW",
      isActive: false,
      users: { connect: { id: adminUserId } },
    },
  });
};