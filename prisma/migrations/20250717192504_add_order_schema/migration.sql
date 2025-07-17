/*
  Warnings:

  - Added the required column `successPage` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `successPagefield` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SuccessPage" AS ENUM ('message', 'redirect');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "successPage" "SuccessPage" NOT NULL,
ADD COLUMN     "successPagefield" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postCode" TEXT,
    "apartmentOrHouse" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
