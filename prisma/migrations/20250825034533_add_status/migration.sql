-- CreateEnum
CREATE TYPE "ServiceOrderStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "ServiceOrder" ADD COLUMN     "status" "ServiceOrderStatus" NOT NULL DEFAULT 'pending';
