/*
  Warnings:

  - You are about to drop the column `fristName` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `name` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "fristName",
DROP COLUMN "lastName",
ADD COLUMN     "name" TEXT NOT NULL;
