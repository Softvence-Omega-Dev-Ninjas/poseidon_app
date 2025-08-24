/*
  Warnings:

  - Changed the type of `success` on the `Service` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Success" AS ENUM ('message', 'redirect');

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "success",
ADD COLUMN     "success" "Success" NOT NULL;
