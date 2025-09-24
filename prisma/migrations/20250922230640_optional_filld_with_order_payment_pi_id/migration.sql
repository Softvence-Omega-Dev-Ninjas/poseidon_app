/*
  Warnings:

  - Added the required column `color` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "color" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PaymentDetailsByShop" ALTER COLUMN "pi_number" DROP NOT NULL;
