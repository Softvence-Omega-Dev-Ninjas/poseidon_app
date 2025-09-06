/*
  Warnings:

  - You are about to drop the column `Quantity` on the `SupportCartLayoutQuantity` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `SupportCartLayoutQuantity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SupportCartLayoutQuantity" DROP COLUMN "Quantity",
ADD COLUMN     "quantity" INTEGER NOT NULL;
