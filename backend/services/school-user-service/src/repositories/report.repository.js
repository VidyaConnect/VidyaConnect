// backend/services/school-user-service/src/repositories/report.repository.js
// Read-only queries used by the System Reports page (super admin).
import prisma from "../config/prisma.js";

// Students have no login, and the single super admin is not shown in reports.
export const ACCOUNT_ROLES = ["PARENT", "TEACHER", "SCHOOL_ADMIN"];

export const countSchools = async (monthStart) => {
  const approved = { status: "APPROVED" };
  const [total, active, newThisMonth] = await Promise.all([
    prisma.school.count({ where: approved }),
    prisma.school.count({ where: { ...approved, isActive: true } }),
    prisma.school.count({ where: { ...approved, createdAt: { gte: monthStart } } }),
  ]);
  return { total, active, newThisMonth };
};

export const countAccountsByRole = async () => {
  return prisma.user.groupBy({
    by: ["role"],
    where: { role: { in: ACCOUNT_ROLES }, isActive: true },
    _count: { _all: true },
  });
};

export const findSchoolCreatedDatesSince = async (since) => {
  return prisma.school.findMany({
    where: { status: "APPROVED", createdAt: { gte: since } },
    select: { createdAt: true },
  });
};

export const countSchoolsByStatus = async () => {
  return prisma.school.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
};

export const countAccountsBySchool = async () => {
  return prisma.user.groupBy({
    by: ["schoolId", "isActive"],
    where: { role: { in: ACCOUNT_ROLES }, schoolId: { not: null } },
    _count: { _all: true },
  });
};

export const findApprovedSchoolNames = async () => {
  return prisma.school.findMany({
    where: { status: "APPROVED" },
    select: { id: true, name: true },
  });
};