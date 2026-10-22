CREATE SCHEMA IF NOT EXISTS "school_user";

-- CreateEnum
CREATE TYPE "school_user"."Role" AS ENUM ('ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'PARENT', 'STUDENT');

-- CreateTable
CREATE TABLE "school_user"."schools" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "logoUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_user"."users" (
    "id" TEXT NOT NULL,
    "keycloakId" TEXT NOT NULL,
    "schoolId" TEXT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" "school_user"."Role" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_user"."students" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "parentId" TEXT,
    "classId" TEXT,
    "admissionNumber" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "enrollmentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_user"."teachers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_user"."parents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "occupation" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_user"."classes" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "classTeacherId" TEXT,
    "className" TEXT NOT NULL,
    "gradeLevel" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "school_user"."schools_email_key" ON "school_user"."schools"("email");

-- CreateIndex
CREATE UNIQUE INDEX "school_user"."users_keycloakId_key" ON "school_user"."users"("keycloakId");

-- CreateIndex
CREATE UNIQUE INDEX "school_user"."users_email_key" ON "school_user"."users"("email");

-- CreateIndex
CREATE INDEX "school_user"."users_schoolId_idx" ON "school_user"."users"("schoolId");

-- CreateIndex
CREATE INDEX "school_user"."users_role_idx" ON "school_user"."users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "school_user"."students_userId_key" ON "school_user"."students"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "school_user"."students_admissionNumber_key" ON "school_user"."students"("admissionNumber");

-- CreateIndex
CREATE INDEX "school_user"."students_schoolId_idx" ON "school_user"."students"("schoolId");

-- CreateIndex
CREATE INDEX "school_user"."students_classId_idx" ON "school_user"."students"("classId");

-- CreateIndex
CREATE INDEX "school_user"."students_parentId_idx" ON "school_user"."students"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "school_user"."teachers_userId_key" ON "school_user"."teachers"("userId");

-- CreateIndex
CREATE INDEX "school_user"."teachers_schoolId_idx" ON "school_user"."teachers"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "school_user"."parents_userId_key" ON "school_user"."parents"("userId");

-- CreateIndex
CREATE INDEX "school_user"."parents_schoolId_idx" ON "school_user"."parents"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "school_user"."classes_classTeacherId_key" ON "school_user"."classes"("classTeacherId");

-- CreateIndex
CREATE INDEX "school_user"."classes_schoolId_idx" ON "school_user"."classes"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "school_user"."classes_schoolId_className_gradeLevel_academicYear_key" ON "school_user"."classes"("schoolId", "className", "gradeLevel", "academicYear");

-- AddForeignKey
ALTER TABLE "school_user"."users" ADD CONSTRAINT "users_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "school_user"."schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_user"."students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "school_user"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_user"."students" ADD CONSTRAINT "students_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "school_user"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_user"."students" ADD CONSTRAINT "students_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "school_user"."parents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_user"."students" ADD CONSTRAINT "students_classId_fkey" FOREIGN KEY ("classId") REFERENCES "school_user"."classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_user"."teachers" ADD CONSTRAINT "teachers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "school_user"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_user"."teachers" ADD CONSTRAINT "teachers_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "school_user"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_user"."parents" ADD CONSTRAINT "parents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "school_user"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_user"."parents" ADD CONSTRAINT "parents_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "school_user"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_user"."classes" ADD CONSTRAINT "classes_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "school_user"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_user"."classes" ADD CONSTRAINT "classes_classTeacherId_fkey" FOREIGN KEY ("classTeacherId") REFERENCES "school_user"."teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;