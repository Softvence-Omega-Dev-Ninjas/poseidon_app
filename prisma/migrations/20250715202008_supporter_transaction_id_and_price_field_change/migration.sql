/*
  Warnings:

  - You are about to drop the column `Transaction_id` on the `SupporterPay` table. All the data in the column will be lost.
  - You are about to drop the column `total_pay` on the `SupporterPay` table. All the data in the column will be lost.
  - Added the required column `total_price` to the `SupporterPay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_id` to the `SupporterPay` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cheers_live_package_type" DROP CONSTRAINT "Cheers_live_package_type_support_cart_layout_id_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userid_fkey";

-- DropForeignKey
ALTER TABLE "SupporterPay" DROP CONSTRAINT "SupporterPay_author_id_fkey";

-- DropForeignKey
ALTER TABLE "SupporterPay" DROP CONSTRAINT "SupporterPay_user_id_fkey";

-- AlterTable
ALTER TABLE "SupporterPay" DROP COLUMN "Transaction_id",
DROP COLUMN "total_pay",
ADD COLUMN     "total_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "transaction_id" TEXT NOT NULL,
ALTER COLUMN "author_id" DROP NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SupporterPay" ADD CONSTRAINT "SupporterPay_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupporterPay" ADD CONSTRAINT "SupporterPay_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cheers_live_package_type" ADD CONSTRAINT "Cheers_live_package_type_support_cart_layout_id_fkey" FOREIGN KEY ("support_cart_layout_id") REFERENCES "SupportCartLayout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
