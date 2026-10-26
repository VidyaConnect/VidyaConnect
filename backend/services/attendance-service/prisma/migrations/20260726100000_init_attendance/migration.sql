-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "attendance";

-- CreateEnum
CREATE TYPE "attendance"."AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXEMPTED', 'NOT_MARKED');

-- CreateTable
CREATE TABLE "attendance"."class_roster_entries" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "rollNumber" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "class_roster_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance"."attendance_records" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "rollNumber" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "status" "attendance"."AttendanceStatus" NOT NULL DEFAULT 'NOT_MARKED',
    "markedById" TEXT,
    "markedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance"."absence_responses" (
    "id" TEXT NOT NULL,
    "attendanceRecordId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "fileId" TEXT,
    "fileName" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "absence_responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "class_roster_entries_schoolId_studentId_key" ON "attendance"."class_roster_entries"("schoolId", "studentId");

-- CreateIndex
CREATE INDEX "class_roster_entries_schoolId_classId_idx" ON "attendance"."class_roster_entries"("schoolId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_records_schoolId_studentId_date_key" ON "attendance"."attendance_records"("schoolId", "studentId", "date");

-- CreateIndex
CREATE INDEX "attendance_records_schoolId_classId_date_idx" ON "attendance"."attendance_records"("schoolId", "classId", "date");

-- CreateIndex
CREATE INDEX "attendance_records_schoolId_date_idx" ON "attendance"."attendance_records"("schoolId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "absence_responses_attendanceRecordId_key" ON "attendance"."absence_responses"("attendanceRecordId");

-- CreateIndex
CREATE INDEX "absence_responses_schoolId_studentId_idx" ON "attendance"."absence_responses"("schoolId", "studentId");

-- AddForeignKey
ALTER TABLE "attendance"."absence_responses" ADD CONSTRAINT "absence_responses_attendanceRecordId_fkey" FOREIGN KEY ("attendanceRecordId") REFERENCES "attendance"."attendance_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;