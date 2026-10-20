/*
  Warnings:

  - A unique constraint covering the columns `[censusNumber]` on the table `schools` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "LinkRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Relationship" AS ENUM ('FATHER', 'MOTHER', 'GUARDIAN');

-- AlterTable
ALTER TABLE "schools" ADD COLUMN     "censusNumber" TEXT;

-- CreateTable
CREATE TABLE "link_requests" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "admissionNumber" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "censusNumber" TEXT NOT NULL,
    "nic" TEXT NOT NULL,
    "relationship" "Relationship" NOT NULL,
    "documentPath" TEXT NOT NULL,
    "schoolId" TEXT,
    "studentId" TEXT,
    "status" "LinkRequestStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "rejectReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "link_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "link_requests_parentId_idx" ON "link_requests"("parentId");

-- CreateIndex
CREATE INDEX "link_requests_schoolId_status_idx" ON "link_requests"("schoolId", "status");

-- CreateIndex
CREATE INDEX "link_requests_studentId_status_idx" ON "link_requests"("studentId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "schools_censusNumber_key" ON "schools"("censusNumber");

-- AddForeignKey
ALTER TABLE "link_requests" ADD CONSTRAINT "link_requests_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "link_requests" ADD CONSTRAINT "link_requests_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "link_requests" ADD CONSTRAINT "link_requests_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "link_requests" ADD CONSTRAINT "link_requests_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
