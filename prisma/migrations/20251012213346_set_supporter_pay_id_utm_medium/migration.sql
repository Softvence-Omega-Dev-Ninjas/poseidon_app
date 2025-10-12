/*
  Warnings:

  - You are about to drop the column `supporterPayId` on the `ScheduledEvent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[supporterPayId__utm_medium]` on the table `ScheduledEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."ScheduledEvent" DROP CONSTRAINT "ScheduledEvent_supporterPayId_fkey";

-- DropIndex
DROP INDEX "public"."ScheduledEvent_supporterPayId_key";

-- AlterTable
ALTER TABLE "ScheduledEvent" DROP COLUMN "supporterPayId",
ADD COLUMN     "supporterPayId__utm_medium" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledEvent_supporterPayId__utm_medium_key" ON "ScheduledEvent"("supporterPayId__utm_medium");

-- AddForeignKey
ALTER TABLE "ScheduledEvent" ADD CONSTRAINT "ScheduledEvent_supporterPayId__utm_medium_fkey" FOREIGN KEY ("supporterPayId__utm_medium") REFERENCES "SupporterPay"("id") ON DELETE SET NULL ON UPDATE CASCADE;
