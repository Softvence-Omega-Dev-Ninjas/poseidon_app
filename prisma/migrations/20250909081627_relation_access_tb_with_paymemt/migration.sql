/*
  Warnings:

  - You are about to drop the column `endDate` on the `PermissionGalleryAccess` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `PermissionMessagesAccess` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `PermissionPostsAccess` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `PermissionVideoCallAccess` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentId]` on the table `PermissionGalleryAccess` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentId]` on the table `PermissionMessagesAccess` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentId]` on the table `PermissionPostsAccess` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentId]` on the table `PermissionVideoCallAccess` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentId` to the `PermissionGalleryAccess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentId` to the `PermissionMessagesAccess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentId` to the `PermissionPostsAccess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentId` to the `PermissionVideoCallAccess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cs_number` to the `paymentDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `paymentDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PermissionGalleryAccess" DROP COLUMN "endDate",
ADD COLUMN     "paymentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PermissionMessagesAccess" DROP COLUMN "endDate",
ADD COLUMN     "paymentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PermissionPostsAccess" DROP COLUMN "endDate",
ADD COLUMN     "paymentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PermissionVideoCallAccess" DROP COLUMN "endDate",
ADD COLUMN     "paymentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "paymentDetails" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "cs_number" TEXT NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "paymemtStatus" TEXT NOT NULL DEFAULT 'painting';

-- CreateIndex
CREATE UNIQUE INDEX "PermissionGalleryAccess_paymentId_key" ON "PermissionGalleryAccess"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionMessagesAccess_paymentId_key" ON "PermissionMessagesAccess"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionPostsAccess_paymentId_key" ON "PermissionPostsAccess"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionVideoCallAccess_paymentId_key" ON "PermissionVideoCallAccess"("paymentId");

-- AddForeignKey
ALTER TABLE "PermissionVideoCallAccess" ADD CONSTRAINT "PermissionVideoCallAccess_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "paymentDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionMessagesAccess" ADD CONSTRAINT "PermissionMessagesAccess_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "paymentDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionGalleryAccess" ADD CONSTRAINT "PermissionGalleryAccess_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "paymentDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionPostsAccess" ADD CONSTRAINT "PermissionPostsAccess_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "paymentDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
