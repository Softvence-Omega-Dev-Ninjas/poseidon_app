/*
  Warnings:

  - Added the required column `titleName` to the `Membership_levels` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Membership_levels" ADD COLUMN     "titleName" TEXT NOT NULL;
