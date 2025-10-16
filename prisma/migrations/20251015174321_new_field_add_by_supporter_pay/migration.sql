/*
  Warnings:

  - Added the required column `email` to the `SupporterPay` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SupporterPay" ADD COLUMN     "email" TEXT NOT NULL;
