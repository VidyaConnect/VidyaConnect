import { prisma } from "../config/prisma.js";

/** A parent's own child, with the class teacher. null if the child is not linked to this parent. */
export async function getChildForParent(parentKeycloakId, studentId) {
  const rows = await prisma.$queryRaw`
    SELECT
      s.id               AS "studentId",
      su."fullName"      AS "studentName",
      s."schoolId"       AS "schoolId",
      s."classId"        AS "classId",
      c."className"      AS "className",
      tu.id              AS "teacherUserId",
      tu."fullName"      AS "teacherName",
      pu.id              AS "parentUserId",
      pu."fullName"      AS "parentName"
    FROM school_user.students s
    JOIN school_user.users su      ON su.id = s."userId"
    JOIN school_user.parents p     ON p.id = s."parentId"
    JOIN school_user.users pu      ON pu.id = p."userId"
    LEFT JOIN school_user.classes c  ON c.id = s."classId"
    LEFT JOIN school_user.teachers t ON t.id = c."classTeacherId"
    LEFT JOIN school_user.users tu   ON tu.id = t."userId"
    WHERE pu."keycloakId" = ${parentKeycloakId}
      AND s.id = ${studentId}
      AND s."isActive" = true
    LIMIT 1
  `;
  return rows[0] ?? null;
}

/** A student in this teacher's class. null if the teacher is not that class's teacher. */
export async function getStudentForTeacher(teacherKeycloakId, studentId) {
  const rows = await prisma.$queryRaw`
    SELECT
      s.id               AS "studentId",
      su."fullName"      AS "studentName",
      s."schoolId"       AS "schoolId",
      s."classId"        AS "classId",
      c."className"      AS "className",
      tu.id              AS "teacherUserId",
      tu."fullName"      AS "teacherName",
      pu.id              AS "parentUserId",
      pu."fullName"      AS "parentName"
    FROM school_user.students s
    JOIN school_user.users su      ON su.id = s."userId"
    JOIN school_user.classes c     ON c.id = s."classId"
    JOIN school_user.teachers t    ON t.id = c."classTeacherId"
    JOIN school_user.users tu      ON tu.id = t."userId"
    LEFT JOIN school_user.parents p ON p.id = s."parentId"
    LEFT JOIN school_user.users pu  ON pu.id = p."userId"
    WHERE tu."keycloakId" = ${teacherKeycloakId}
      AND s.id = ${studentId}
      AND s."isActive" = true
    LIMIT 1
  `;
  return rows[0] ?? null;
}

/** The school_user row of the logged-in user (found by Keycloak id). */
export async function getUserByKeycloakId(keycloakId) {
  const rows = await prisma.$queryRaw`
    SELECT id, "fullName", role::text AS role
    FROM school_user.users
    WHERE "keycloakId" = ${keycloakId}
    LIMIT 1
  `;
  return rows[0] ?? null;
}