// backend/services/school-user-service/src/services/report.service.js
import * as reportRepository from "../repositories/report.repository.js";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const getSystemSummary = async () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const monthStart = new Date(Date.UTC(year, month, 1));
  const sixMonthsAgo = new Date(Date.UTC(year, month - 5, 1));

  const [schools, roleRows, recentSchools, statusRows, accountRows, schoolNames] =
    await Promise.all([
      reportRepository.countSchools(monthStart),
      reportRepository.countAccountsByRole(),
      reportRepository.findSchoolCreatedDatesSince(sixMonthsAgo),
      reportRepository.countSchoolsByStatus(),
      reportRepository.countAccountsBySchool(),
      reportRepository.findApprovedSchoolNames(),
    ]);

  const byRole = Object.fromEntries(roleRows.map((r) => [r.role, r._count._all]));
  const usersByRole = [
    { role: "Parents", count: byRole.PARENT ?? 0 },
    { role: "Teachers", count: byRole.TEACHER ?? 0 },
    { role: "School admins", count: byRole.SCHOOL_ADMIN ?? 0 },
  ];

  // Last 6 calendar months, oldest first, including months with zero schools
  const newSchoolsByMonth = [];
  for (let i = 0; i < 6; i++) {
    const start = new Date(Date.UTC(year, month - 5 + i, 1));
    const count = recentSchools.filter(
      (s) =>
        s.createdAt.getUTCFullYear() === start.getUTCFullYear() &&
        s.createdAt.getUTCMonth() === start.getUTCMonth()
    ).length;
    newSchoolsByMonth.push({ month: MONTHS[start.getUTCMonth()], count });
  }

  // ---- schools by registration status (zeros included) ----
  const statusCount = Object.fromEntries(statusRows.map((r) => [r.status, r._count._all]));
  const schoolsByStatus = [
    { status: "Under review", count: statusCount.UNDER_REVIEW ?? 0 },
    { status: "Approved", count: statusCount.APPROVED ?? 0 },
    { status: "Rejected", count: statusCount.REJECTED ?? 0 },
  ];

  // ---- school adoption: accounts created vs active, per approved school ----
  const nameById = new Map(schoolNames.map((s) => [s.id, s.name]));
  const perSchool = new Map();
  for (const row of accountRows) {
    if (!nameById.has(row.schoolId)) continue;
    const entry = perSchool.get(row.schoolId) ?? { created: 0, activated: 0 };
    entry.created += row._count._all;
    if (row.isActive) entry.activated += row._count._all;
    perSchool.set(row.schoolId, entry);
  }
  const schoolAdoption = [...perSchool.entries()]
    .map(([id, v]) => ({ school: nameById.get(id), ...v }))
    .sort((a, b) => b.created - a.created)
    .slice(0, 10);

  return {
    totalSchools: schools.total,
    activeSchools: schools.active,
    newSchoolsThisMonth: schools.newThisMonth,
    totalUsers: usersByRole.reduce((sum, r) => sum + r.count, 0),
    usersByRole,
    newSchoolsByMonth,
    schoolsByStatus,
    schoolAdoption,
  };
};


const ROLE_LABEL = { PARENT: "Parent", TEACHER: "Teacher", SCHOOL_ADMIN: "School admin" };

export const getSchoolAccountsSummary = async (keycloakId) => {
  const schoolId = await reportRepository.findSchoolIdByKeycloakId(keycloakId);
  if (!schoolId) {
    const err = new Error("This account is not linked to a school");
    err.status = 403;
    throw err;
  }

  const [countRows, inactive] = await Promise.all([
    reportRepository.countSchoolAccounts(schoolId),
    reportRepository.findInactiveAccounts(schoolId),
  ]);

  const total = countRows.reduce((sum, r) => sum + r._count._all, 0);
  const inactiveCount = countRows.find((r) => !r.isActive)?._count._all ?? 0;

  return {
    totalAccounts: total,
    inactiveAccounts: inactiveCount,
    inactiveList: inactive.map((u) => ({
      name: u.fullName,
      role: ROLE_LABEL[u.role] ?? u.role,
      email: u.email,
    })),
  };
};
