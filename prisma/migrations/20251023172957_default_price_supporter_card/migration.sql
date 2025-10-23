/*
  Warnings:

  - You are about to drop the column `default_price` on the `SupportCartLayout` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SupportCartLayout" DROP COLUMN "default_price";

-- CreateTable
CREATE TABLE "SupportCart_default_price" (
    "id" TEXT NOT NULL,
    "support_cart_layout_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "SupportCart_default_price_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SupportCart_default_price_id_key" ON "SupportCart_default_price"("id");

-- AddForeignKey
ALTER TABLE "SupportCart_default_price" ADD CONSTRAINT "SupportCart_default_price_support_cart_layout_id_fkey" FOREIGN KEY ("support_cart_layout_id") REFERENCES "SupportCartLayout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
