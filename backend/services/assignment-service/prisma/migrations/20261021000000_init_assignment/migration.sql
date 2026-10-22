CREATE SCHEMA IF NOT EXISTS "assignment";

CREATE TYPE "assignment"."AssignmentStatus" AS ENUM ('DRAFT', 'PUBLISHED');
CREATE TYPE "assignment"."AssignmentProgressStatus" AS ENUM ('PENDING', 'COMPLETED', 'MISSING');

CREATE TABLE "assignment"."assignments" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "teacherName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "publishAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "status" "assignment"."AssignmentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "assignments_schoolId_classId_status_idx" ON "assignment"."assignments"("schoolId", "classId", "status");
CREATE INDEX "assignments_schoolId_dueAt_idx" ON "assignment"."assignments"("schoolId", "dueAt");
CREATE INDEX "assignments_schoolId_teacherId_idx" ON "assignment"."assignments"("schoolId", "teacherId");

CREATE TABLE "assignment"."assignment_attachments" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "assignment_attachments_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "assignment_attachments_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignment"."assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "assignment_attachments_assignmentId_fileId_key" ON "assignment"."assignment_attachments"("assignmentId", "fileId");

CREATE TABLE "assignment"."assignment_student_statuses" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "rollNumber" TEXT,
    "status" "assignment"."AssignmentProgressStatus" NOT NULL DEFAULT 'PENDING',
    "marks" DOUBLE PRECISION,
    "feedback" TEXT,
    "markedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "assignment_student_statuses_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "assignment_student_statuses_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignment"."assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "assignment_student_statuses_assignmentId_studentId_key" ON "assignment"."assignment_student_statuses"("assignmentId", "studentId");
CREATE INDEX "assignment_student_statuses_schoolId_studentId_status_idx" ON "assignment"."assignment_student_statuses"("schoolId", "studentId", "status");

