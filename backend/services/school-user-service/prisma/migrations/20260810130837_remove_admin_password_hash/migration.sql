/*
  Warnings:

  - You are about to drop the column `adminPasswordHash` on the `schools` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "school_user"."schools" DROP COLUMN "adminPasswordHash";