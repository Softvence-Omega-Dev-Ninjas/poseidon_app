/*
  Warnings:

  - Added the required column `description` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "cover_image" TEXT,
ADD COLUMN     "description" TEXT NOT NULL;
