/*
  Warnings:

  - You are about to drop the column `draft` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "draft",
ADD COLUMN     "drafted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "cover_image" TEXT;
