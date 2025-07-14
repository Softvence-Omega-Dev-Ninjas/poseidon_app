/*
  Warnings:

  - You are about to drop the column `supporter_id` on the `SupporterPay` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `SupporterPay` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'supporter', 'user');

-- DropForeignKey
ALTER TABLE "SupporterPay" DROP CONSTRAINT "SupporterPay_supporter_id_fkey";

-- AlterTable
ALTER TABLE "SupporterPay" DROP COLUMN "supporter_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user',
ALTER COLUMN "provider" SET DEFAULT 'credentials';

-- AddForeignKey
ALTER TABLE "SupporterPay" ADD CONSTRAINT "SupporterPay_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
