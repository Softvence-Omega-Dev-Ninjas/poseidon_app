-- DropForeignKey
ALTER TABLE "PermissionGalleryAccess" DROP CONSTRAINT "PermissionGalleryAccess_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "PermissionMessagesAccess" DROP CONSTRAINT "PermissionMessagesAccess_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "PermissionPostsAccess" DROP CONSTRAINT "PermissionPostsAccess_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "PermissionVideoCallAccess" DROP CONSTRAINT "PermissionVideoCallAccess_paymentId_fkey";

-- AddForeignKey
ALTER TABLE "PermissionVideoCallAccess" ADD CONSTRAINT "PermissionVideoCallAccess_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "paymentDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionMessagesAccess" ADD CONSTRAINT "PermissionMessagesAccess_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "paymentDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionGalleryAccess" ADD CONSTRAINT "PermissionGalleryAccess_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "paymentDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionPostsAccess" ADD CONSTRAINT "PermissionPostsAccess_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "paymentDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;
