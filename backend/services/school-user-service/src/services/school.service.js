import { findSchoolById } from "../repositories/school.repository.js";

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