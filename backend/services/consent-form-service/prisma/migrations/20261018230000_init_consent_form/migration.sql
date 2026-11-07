CREATE SCHEMA IF NOT EXISTS "consent_form";

CREATE TYPE "consent_form"."ConsentFormStatus" AS ENUM ('DRAFT', 'ACTIVE', 'CLOSED');
CREATE TYPE "consent_form"."ConsentResponseStatus" AS ENUM ('ACCEPTED', 'DECLINED');

CREATE TABLE "consent_form"."consent_forms" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "instructions" TEXT,
  "audience" TEXT NOT NULL,
  "classId" TEXT,
  "scope" TEXT NOT NULL,
  "status" "consent_form"."ConsentFormStatus" NOT NULL DEFAULT 'DRAFT',
  "schoolId" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL,
  "publishedAt" TIMESTAMP(3),
  "deadline" TIMESTAMP(3) NOT NULL,
  "closedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "consent_forms_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "consent_form"."consent_recipients" (
  "id" TEXT NOT NULL,
  "formId" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "status" "consent_form"."ConsentResponseStatus",
  "remarks" TEXT,
  "respondedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "consent_recipients_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "consent_recipients_formId_studentId_key" ON "consent_form"."consent_recipients"("formId", "studentId");
CREATE INDEX "consent_forms_schoolId_idx" ON "consent_form"."consent_forms"("schoolId");
CREATE INDEX "consent_forms_createdBy_idx" ON "consent_form"."consent_forms"("createdBy");
CREATE INDEX "consent_forms_status_idx" ON "consent_form"."consent_forms"("status");
CREATE INDEX "consent_recipients_studentId_idx" ON "consent_form"."consent_recipients"("studentId");
ALTER TABLE "consent_form"."consent_recipients" ADD CONSTRAINT "consent_recipients_formId_fkey" FOREIGN KEY ("formId") REFERENCES "consent_form"."consent_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
