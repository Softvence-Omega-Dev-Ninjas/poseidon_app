/*
  Warnings:

  - The `paymemtStatus` column on the `paymentDetails` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PaymemtStatus" AS ENUM ('pending', 'unpaid', 'paid');

-- DropForeignKey
ALTER TABLE "SupporterPay" DROP CONSTRAINT "SupporterPay_user_id_fkey";

-- AlterTable
ALTER TABLE "SupporterPay" ADD COLUMN     "paymemtStatus" "PaymemtStatus" NOT NULL DEFAULT 'pending',
ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "paymentDetails" ALTER COLUMN "buyerId" DROP NOT NULL,
DROP COLUMN "paymemtStatus",
ADD COLUMN     "paymemtStatus" "PaymemtStatus" NOT NULL DEFAULT 'pending';

-- AddForeignKey
ALTER TABLE "SupporterPay" ADD CONSTRAINT "SupporterPay_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
