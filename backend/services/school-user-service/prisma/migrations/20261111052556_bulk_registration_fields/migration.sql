/*
  Warnings:

  - A unique constraint covering the columns `[schoolId,admissionNumber]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[schoolId,teacherCode]` on the table `teachers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "students_admissionNumber_key";

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "teacherCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "students_schoolId_admissionNumber_key" ON "students"("schoolId", "admissionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_schoolId_teacherCode_key" ON "teachers"("schoolId", "teacherCode");
