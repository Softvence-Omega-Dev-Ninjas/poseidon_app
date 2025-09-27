/*
  Warnings:

  - You are about to drop the column `status` on the `ServiceOrder` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ServiceOrder" DROP CONSTRAINT "ServiceOrder_serviceId_fkey";

-- AlterTable
ALTER TABLE "ServiceOrder" DROP COLUMN "status",
ALTER COLUMN "serviceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ServiceOrder" ADD CONSTRAINT "ServiceOrder_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
