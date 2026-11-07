import {
  findSchoolById,
  findSchoolByEmail,
  createSchoolRegistration,
} from "../repositories/school.repository.js";

export const getCurrentSchoolContext = async (schoolId) => {
  if (!schoolId) {
    throw new Error("School context not found");
  }

  const school = await findSchoolById(schoolId);

  if (!school) {
    throw new Error("School not found");
  }

  return school;
};

export const registerSchool = async (payload, verificationDocUrl) => {
  const {
    name,
    email,
    phone,
    address,
    schoolType,
    principalName,
    region,
    district,
    studentCount,
    teacherCount,
    adminEmail,
    adminFirstName,
    adminLastName,
  } = payload;

  const existing = await findSchoolByEmail(email);
  if (existing) {
    const err = new Error("A school with this email is already registered");
    err.statusCode = 409;
    throw err;
  }

  
  const school = await createSchoolRegistration({
    name,
    email,
    phone,
    address,
    schoolType,
    principalName,
    region,
    district,
    studentCount: Number(studentCount),
    teacherCount: Number(teacherCount),
    verificationDocUrl,
    adminEmail,
    adminFirstName,
    adminLastName,
  });

  return {
    admissionId: school.id,
    status: school.status,
    estimatedWaitHours: "48",
  };
};