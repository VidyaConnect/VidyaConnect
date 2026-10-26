import {
  findSchoolById,
  findSchoolByEmail,
  findSchoolByCensusNumber,
  createSchoolRegistration,
} from "../repositories/school.repository.js";
import { findUserByKeycloakId } from "../repositories/user.repository.js";
import { httpError } from "../utils/httpError.js";

const ESTIMATED_WAIT_HOURS = "48";

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

export const registerSchool = async (payload, verificationDocUrl, keycloakId) => {
  // 1. Who is registering? Must be a logged-in School Admin.
  const user = keycloakId ? await findUserByKeycloakId(keycloakId) : null;
  if (!user) throw httpError(401, "Please sign in to register a school");
  if (user.role !== "SCHOOL_ADMIN") {
    throw httpError(403, "Only a School Admin can register a school");
  }
  if (user.schoolId) {
    throw httpError(409, "You have already registered a school");
  }

  // 2. Check the data
  const {
    name, email, phone, address, censusNumber,
    schoolType, principalName, region, district,
    studentCount, teacherCount,
  } = payload;

  const required = { name, email, schoolType, principalName, region, district };
  for (const [field, value] of Object.entries(required)) {
    if (!value?.toString().trim()) {
      throw httpError(400, `${field} is required`);
    }
  }

  const students = Number(studentCount);
  const teachers = Number(teacherCount);
  if (
    !Number.isInteger(students) || students < 0 ||
    !Number.isInteger(teachers) || teachers < 0
  ) {
    throw httpError(400, "Student and teacher counts must be whole numbers");
  }

  const census = censusNumber?.toString().trim() || null;

  // 3. Duplicates
  if (await findSchoolByEmail(email)) {
    throw httpError(409, "A school with this email is already registered");
  }
  if (census && (await findSchoolByCensusNumber(census))) {
    throw httpError(409, "A school with this census number is already registered");
  }

  // 4. Admin details come from the logged-in account, not from the request
  const [adminFirstName, ...restName] = user.fullName.trim().split(/\s+/);
  const adminLastName = restName.join(" ") || adminFirstName;

  // 5. Save the school and link it to this admin
  let school;
  try {
    school = await createSchoolRegistration(
      {
        name,
        email,
        phone,
        address,
        censusNumber: census,
        schoolType,
        principalName,
        region,
        district,
        studentCount: students,
        teacherCount: teachers,
        verificationDocUrl,
        adminEmail: user.email,
        adminFirstName,
        adminLastName,
      },
      user.id
    );
  } catch (err) {
    if (err.code === "P2002") {
      const target = String(err.meta?.target ?? "");
      if (target.includes("census")) {
        throw httpError(409, "A school with this census number is already registered");
      }
      throw httpError(409, "A school with this email is already registered");
    }
    throw err;
  }

  return {
    admissionId: school.id,
    status: school.status,
    estimatedWaitHours: ESTIMATED_WAIT_HOURS,
  };
};