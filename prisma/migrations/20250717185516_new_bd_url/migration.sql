/*
  Warnings:

  - Made the column `author_id` on table `SupporterPay` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `SupporterPay` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "SupporterPay" DROP CONSTRAINT "SupporterPay_author_id_fkey";

-- DropForeignKey
ALTER TABLE "SupporterPay" DROP CONSTRAINT "SupporterPay_user_id_fkey";

-- AlterTable
ALTER TABLE "SupporterPay" ALTER COLUMN "author_id" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "SupporterPay" ADD CONSTRAINT "SupporterPay_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupporterPay" ADD CONSTRAINT "SupporterPay_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
