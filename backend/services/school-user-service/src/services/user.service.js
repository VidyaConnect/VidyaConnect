import {
  findUserByKeycloakId,
  findClassByTeacherId,
  findClassesByTeacherId,
} from "../repositories/user.repository.js";

export const getCurrentUserProfile = async (keycloakId) => {
  const user = await findUserByKeycloakId(keycloakId);

  if (!user) {
    throw new Error("User profile not found");
  }

  return user;
};

export async function getTeacherClass(keycloakId) {
  const user = await findUserByKeycloakId(keycloakId);
  if (!user || !user.teacher) {
    const error = new Error("Teacher profile not found");
    error.status = 404;
    throw error;
  }

  const cls = await findClassByTeacherId(user.teacher.id);
  if (!cls) {
    const error = new Error("No class assigned to this teacher");
    error.status = 404;
    throw error;
  }

  return { schoolId: cls.schoolId, classId: cls.id, className: cls.className };
}

export async function getTeacherClasses(keycloakId) {
  const user = await findUserByKeycloakId(keycloakId);
  if (!user || !user.teacher) {
    const error = new Error("Teacher profile not found");
    error.status = 404;
    throw error;
  }

  const classes = await findClassesByTeacherId(user.teacher.id);
  return classes.map((cls) => ({
    schoolId: cls.schoolId,
    classId: cls.id,
    className: cls.className,
    gradeLevel: cls.gradeLevel,
    academicYear: cls.academicYear,
  }));
}
