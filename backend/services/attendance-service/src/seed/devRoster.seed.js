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
    classId: "class-9b",
    className: "Grade 9B",
    studentId: "student-005",
    studentName: "Kavindu Jayawardena",
    rollNumber: "BB001",
  },
];

export async function ensureSeedRoster(schoolId) {
  const existingCount = await prisma.classRosterEntry.count({
    where: { schoolId },
  });

  if (existingCount > 0) {
    return;
  }

  await prisma.classRosterEntry.createMany({
    data: DEFAULT_ROSTER.map((entry) => ({
      schoolId,
      ...entry,
    })),
  });
}
