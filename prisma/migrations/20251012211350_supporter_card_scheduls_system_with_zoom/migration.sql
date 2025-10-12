/*
  Warnings:

  - A unique constraint covering the columns `[supporterPayId]` on the table `ScheduledEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Cheers_live_package_type" ADD COLUMN     "scheduling_url" TEXT,
ADD COLUMN     "uri" TEXT;

-- AlterTable
ALTER TABLE "ScheduledEvent" ADD COLUMN     "supporterPayId" TEXT;

-- AlterTable
ALTER TABLE "SupporterPay" ADD COLUMN     "scheduling_url" TEXT,
ADD COLUMN     "uri" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledEvent_supporterPayId_key" ON "ScheduledEvent"("supporterPayId");

-- AddForeignKey
ALTER TABLE "ScheduledEvent" ADD CONSTRAINT "ScheduledEvent_supporterPayId_fkey" FOREIGN KEY ("supporterPayId") REFERENCES "SupporterPay"("id") ON DELETE SET NULL ON UPDATE CASCADE;
