/*
  Warnings:

  - You are about to drop the column `isReferral` on the `Referral` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Referral" DROP COLUMN "isReferral",
ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false;
