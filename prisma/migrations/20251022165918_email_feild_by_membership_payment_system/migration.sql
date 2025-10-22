-- DropForeignKey
ALTER TABLE "public"."PermissionGalleryAccess" DROP CONSTRAINT "PermissionGalleryAccess_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."PermissionMessagesAccess" DROP CONSTRAINT "PermissionMessagesAccess_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."PermissionPostsAccess" DROP CONSTRAINT "PermissionPostsAccess_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."PermissionVideoCallAccess" DROP CONSTRAINT "PermissionVideoCallAccess_user_id_fkey";

-- AlterTable
ALTER TABLE "PermissionGalleryAccess" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PermissionMessagesAccess" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PermissionPostsAccess" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PermissionVideoCallAccess" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "paymentDetails" ADD COLUMN     "email" TEXT;

-- AddForeignKey
ALTER TABLE "PermissionVideoCallAccess" ADD CONSTRAINT "PermissionVideoCallAccess_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionMessagesAccess" ADD CONSTRAINT "PermissionMessagesAccess_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionGalleryAccess" ADD CONSTRAINT "PermissionGalleryAccess_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionPostsAccess" ADD CONSTRAINT "PermissionPostsAccess_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
