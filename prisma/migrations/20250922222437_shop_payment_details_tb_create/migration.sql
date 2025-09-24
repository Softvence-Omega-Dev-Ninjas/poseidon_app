/*
  Warnings:

  - You are about to drop the column `paymentId` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentId";

-- CreateTable
CREATE TABLE "PaymentDetailsByShop" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "pi_number" TEXT NOT NULL,
    "paymemtStatus" "PaymemtStatus" NOT NULL DEFAULT 'pending',
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "PaymentDetailsByShop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentDetailsByShop_orderId_key" ON "PaymentDetailsByShop"("orderId");

-- AddForeignKey
ALTER TABLE "PaymentDetailsByShop" ADD CONSTRAINT "PaymentDetailsByShop_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
