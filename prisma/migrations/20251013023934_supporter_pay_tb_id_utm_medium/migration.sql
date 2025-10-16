/*
  Warnings:

  - You are about to drop the column `supporterPayId_utm_medium` on the `ScheduledEvent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[supporterPayTbId_utm_medium]` on the table `ScheduledEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."ScheduledEvent" DROP CONSTRAINT "ScheduledEvent_supporterPayId_utm_medium_fkey";

-- DropIndex
DROP INDEX "public"."ScheduledEvent_supporterPayId_utm_medium_key";

-- AlterTable
ALTER TABLE "ScheduledEvent" DROP COLUMN "supporterPayId_utm_medium",
ADD COLUMN     "supporterPayTbId_utm_medium" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledEvent_supporterPayTbId_utm_medium_key" ON "ScheduledEvent"("supporterPayTbId_utm_medium");

-- AddForeignKey
ALTER TABLE "ScheduledEvent" ADD CONSTRAINT "ScheduledEvent_supporterPayTbId_utm_medium_fkey" FOREIGN KEY ("supporterPayTbId_utm_medium") REFERENCES "SupporterPay"("id") ON DELETE SET NULL ON UPDATE CASCADE;
