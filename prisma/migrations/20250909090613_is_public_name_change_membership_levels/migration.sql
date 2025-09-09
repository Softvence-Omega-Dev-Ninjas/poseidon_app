/*
  Warnings:

  - You are about to drop the column `public` on the `Membership_levels` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Membership_levels" DROP COLUMN "public",
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;
