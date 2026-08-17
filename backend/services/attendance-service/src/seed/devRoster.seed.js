import prisma from "../config/prisma.js";

const DEFAULT_ROSTER = [
  {
    classId: "class-8a",
    className: "Grade 8A",
    studentId: "student-001",
    studentName: "Alex Rivera",
    rollNumber: "BA001",
  },
  {
    classId: "class-8a",
    className: "Grade 8A",
    studentId: "student-002",
    studentName: "Maya Perera",
    rollNumber: "BA002",
  },
  {
    classId: "class-8a",
    className: "Grade 8A",
    studentId: "student-003",
    studentName: "Dilan Fernando",
    rollNumber: "BA003",
  },
  {
    classId: "class-8a",
    className: "Grade 8A",
    studentId: "student-004",
    studentName: "Anya Silva",
    rollNumber: "BA004",
  },
  {
    classId: "class-8a",
    className: "Grade 8A",
    studentId: "student-005",
    studentName: "Rusiru Bandara",
    rollNumber: "BA005",
  },
  {
    classId: "class-8a",
    className: "Grade 8A",
    studentId: "student-006",
    studentName: "Nethmi Wickramasinghe",
    rollNumber: "BA006",
  },
  {
    classId: "class-9b",
    className: "Grade 9B",
    studentId: "student-007",
    studentName: "Kavindu Jayawardena",
    rollNumber: "BB001",
  },
  {
    classId: "class-9b",
    className: "Grade 9B",
    studentId: "student-008",
    studentName: "Saduni Gallage",
    rollNumber: "BB002",
  },
  {
    classId: "class-9b",
    className: "Grade 9B",
    studentId: "student-009",
    studentName: "Tharindu Liyanage",
    rollNumber: "BB003",
  },
];

export async function ensureSeedRoster(schoolId) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  const existingCount = await prisma.classRosterEntry.count();

  if (existingCount > 0) {
    return;
  }

  await prisma.classRosterEntry.createMany({
    data: DEFAULT_ROSTER.map((entry) => ({
      schoolId,
      ...entry,
    })),
  });

  console.log(`[seed] Seeded ${DEFAULT_ROSTER.length} roster entries for school ${schoolId}`);
}
