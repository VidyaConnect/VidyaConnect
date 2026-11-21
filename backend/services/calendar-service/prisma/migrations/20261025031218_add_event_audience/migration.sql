-- CreateEnum
CREATE TYPE "EventScope" AS ENUM ('PLATFORM', 'SCHOOL', 'CLASS');

-- AlterTable
ALTER TABLE "calendar_events" ADD COLUMN     "classIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "scope" "EventScope" NOT NULL DEFAULT 'SCHOOL';
