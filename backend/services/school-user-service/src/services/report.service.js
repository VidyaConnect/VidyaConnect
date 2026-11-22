// backend/services/school-user-service/src/services/report.service.js
import * as reportRepository from "../repositories/report.repository.js";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const getSystemSummary = async () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const monthStart = new Date(Date.UTC(year, month, 1));
  const sixMonthsAgo = new Date(Date.UTC(year, month - 5, 1));

  const [schools, roleRows, recentSchools] = await Promise.all([
    reportRepository.countSchools(monthStart),
    reportRepository.countAccountsByRole(),
    reportRepository.findSchoolCreatedDatesSince(sixMonthsAgo),
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

  return {
    totalSchools: schools.total,
    activeSchools: schools.active,
    newSchoolsThisMonth: schools.newThisMonth,
    totalUsers: usersByRole.reduce((sum, r) => sum + r.count, 0),
    usersByRole,
    newSchoolsByMonth,
  };
};

