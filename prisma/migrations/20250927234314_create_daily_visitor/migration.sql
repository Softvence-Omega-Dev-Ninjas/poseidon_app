/*
  Warnings:

  - You are about to drop the column `userId` on the `UserVisit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sessionId,visitDate]` on the table `UserVisit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ip` to the `UserVisit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionId` to the `UserVisit` table without a default value. This is not possible if the table is not empty.
  - Made the column `country` on table `UserVisit` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "UserVisit" DROP CONSTRAINT "UserVisit_userId_fkey";

-- DropIndex
DROP INDEX "UserVisit_userId_visitDate_key";

-- AlterTable
ALTER TABLE "UserVisit" DROP COLUMN "userId",
ADD COLUMN     "ip" TEXT NOT NULL,
ADD COLUMN     "sessionId" TEXT NOT NULL,
ALTER COLUMN "country" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserVisit_sessionId_visitDate_key" ON "UserVisit"("sessionId", "visitDate");
