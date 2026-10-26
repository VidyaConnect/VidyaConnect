-- DropForeignKey
ALTER TABLE "parents" DROP CONSTRAINT "parents_schoolId_fkey";

-- AlterTable
ALTER TABLE "parents" ALTER COLUMN "schoolId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;
