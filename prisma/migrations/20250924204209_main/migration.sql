/*
  Warnings:

  - You are about to drop the column `transaction_id` on the `SupporterPay` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentId]` on the table `ServiceOrder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `ProductCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductCategory" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ServiceOrder" ALTER COLUMN "paymentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SupporterPay" DROP COLUMN "transaction_id",
ADD COLUMN     "pi_number" TEXT;

-- CreateTable
CREATE TABLE "PaymentDetailsByServices" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "pi_number" TEXT,
    "paymemtStatus" "PaymemtStatus" NOT NULL DEFAULT 'pending',
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentDetailsByServices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceOrder_paymentId_key" ON "ServiceOrder"("paymentId");

-- AddForeignKey
ALTER TABLE "ServiceOrder" ADD CONSTRAINT "ServiceOrder_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "PaymentDetailsByServices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
