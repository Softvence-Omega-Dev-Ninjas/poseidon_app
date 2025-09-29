/*
  Warnings:

  - You are about to drop the column `sessionId` on the `UserVisit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ip,visitDate]` on the table `UserVisit` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserVisit_sessionId_visitDate_key";

-- AlterTable
ALTER TABLE "UserVisit" DROP COLUMN "sessionId";

-- CreateIndex
CREATE UNIQUE INDEX "UserVisit_ip_visitDate_key" ON "UserVisit"("ip", "visitDate");
