/*
  Warnings:

  - You are about to drop the column `productName` on the `paymentDetails` table. All the data in the column will be lost.
  - Added the required column `serviceName` to the `paymentDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "paymentDetails" DROP COLUMN "productName",
ADD COLUMN     "serviceName" TEXT NOT NULL,
ALTER COLUMN "paymemtStatus" SET DEFAULT 'pending';
