/*
  Warnings:

  - Added the required column `adminEmail` to the `schools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adminFirstName` to the `schools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adminLastName` to the `schools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adminPasswordHash` to the `schools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district` to the `schools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `principalName` to the `schools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `schools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolType` to the `schools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentCount` to the `schools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherCount` to the `schools` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('UNDER_REVIEW', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "schools" ADD COLUMN     "adminEmail" TEXT NOT NULL,
ADD COLUMN     "adminFirstName" TEXT NOT NULL,
ADD COLUMN     "adminLastName" TEXT NOT NULL,
ADD COLUMN     "adminPasswordHash" TEXT NOT NULL,
ADD COLUMN     "district" TEXT NOT NULL,
ADD COLUMN     "principalName" TEXT NOT NULL,
ADD COLUMN     "region" TEXT NOT NULL,
ADD COLUMN     "schoolType" TEXT NOT NULL,
ADD COLUMN     "status" "RegistrationStatus" NOT NULL DEFAULT 'UNDER_REVIEW',
ADD COLUMN     "studentCount" INTEGER NOT NULL,
ADD COLUMN     "teacherCount" INTEGER NOT NULL,
ADD COLUMN     "verificationDocUrl" TEXT;
