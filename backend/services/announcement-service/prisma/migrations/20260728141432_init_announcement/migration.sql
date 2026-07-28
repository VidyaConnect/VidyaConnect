-- CreateEnum
CREATE TYPE "AnnouncementType" AS ENUM ('SYSTEM', 'SCHOOL');

-- CreateEnum
CREATE TYPE "AnnouncementStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AnnouncementPriority" AS ENUM ('NORMAL', 'URGENT', 'EMERGENCY');

-- CreateTable
CREATE TABLE "announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "AnnouncementType" NOT NULL,
    "status" "AnnouncementStatus" NOT NULL DEFAULT 'DRAFT',
    "priority" "AnnouncementPriority" NOT NULL DEFAULT 'NORMAL',
    "schoolId" TEXT,
    "createdByUserId" TEXT NOT NULL,
    "attachmentId" TEXT,
    "requiresConfirmation" BOOLEAN NOT NULL DEFAULT false,
    "isRetracted" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "announcements_schoolId_idx" ON "announcements"("schoolId");

-- CreateIndex
CREATE INDEX "announcements_createdByUserId_idx" ON "announcements"("createdByUserId");

-- CreateIndex
CREATE INDEX "announcements_type_idx" ON "announcements"("type");
