-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_shopId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Shop" DROP CONSTRAINT "Shop_userId_fkey";

-- AlterTable
ALTER TABLE "Membership_levels" ADD COLUMN     "scheduling_url" TEXT,
ADD COLUMN     "url" TEXT;

-- AlterTable
ALTER TABLE "PermissionVideoCallAccess" ADD COLUMN     "scheduling_url" TEXT,
ADD COLUMN     "url" TEXT;

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
