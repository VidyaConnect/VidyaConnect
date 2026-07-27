-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "file";

-- CreateEnum
CREATE TYPE "file"."FileStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'DELETED');

-- CreateTable
CREATE TABLE "file"."file_metadata" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "s3Key" TEXT NOT NULL,
    "s3Bucket" TEXT NOT NULL,
    "status" "file"."FileStatus" NOT NULL DEFAULT 'PENDING',
    "purpose" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "file_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "file_metadata_s3Key_key" ON "file"."file_metadata"("s3Key");

-- CreateIndex
CREATE INDEX "file_metadata_schoolId_idx" ON "file"."file_metadata"("schoolId");

-- CreateIndex
CREATE INDEX "file_metadata_uploadedBy_idx" ON "file"."file_metadata"("uploadedBy");

-- CreateIndex
CREATE INDEX "file_metadata_schoolId_purpose_idx" ON "file"."file_metadata"("schoolId", "purpose");