/*
  Warnings:

  - You are about to drop the column `drafted` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "drafted",
ADD COLUMN     "draft" BOOLEAN NOT NULL DEFAULT false;
