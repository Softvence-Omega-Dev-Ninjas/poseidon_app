/*
  Warnings:

  - The `choose_layout` column on the `SupportCartLayout` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "LayoutType" AS ENUM ('standard', 'suggest');

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userid_fkey";

-- AlterTable
ALTER TABLE "SupportCartLayout" DROP COLUMN "choose_layout",
ADD COLUMN     "choose_layout" "LayoutType" NOT NULL DEFAULT 'standard';

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
