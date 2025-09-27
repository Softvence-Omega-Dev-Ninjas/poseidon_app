/*
  Warnings:

  - You are about to drop the column `paymentId` on the `ServiceOrder` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[serviceOrderId]` on the table `PaymentDetailsByServices` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ServiceOrder" DROP CONSTRAINT "ServiceOrder_paymentId_fkey";

-- DropIndex
DROP INDEX "ServiceOrder_paymentId_key";

-- AlterTable
ALTER TABLE "PaymentDetailsByServices" ADD COLUMN     "serviceOrderId" TEXT;

-- AlterTable
ALTER TABLE "ServiceOrder" DROP COLUMN "paymentId";

-- CreateIndex
CREATE UNIQUE INDEX "PaymentDetailsByServices_serviceOrderId_key" ON "PaymentDetailsByServices"("serviceOrderId");

-- AddForeignKey
ALTER TABLE "PaymentDetailsByServices" ADD CONSTRAINT "PaymentDetailsByServices_serviceOrderId_fkey" FOREIGN KEY ("serviceOrderId") REFERENCES "ServiceOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
