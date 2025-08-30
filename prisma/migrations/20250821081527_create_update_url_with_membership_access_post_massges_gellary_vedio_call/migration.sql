/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Media` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MembershipAccessToGallery" ADD COLUMN     "updateUrl" TEXT NOT NULL DEFAULT 'gallery_update';

-- AlterTable
ALTER TABLE "MembershipAccessToMessages" ADD COLUMN     "updateUrl" TEXT NOT NULL DEFAULT 'messages_update';

-- AlterTable
ALTER TABLE "MembershipAccessToPosts" ADD COLUMN     "updateUrl" TEXT NOT NULL DEFAULT 'posts_update';

-- AlterTable
ALTER TABLE "MembershipAccessToVideoCall" ADD COLUMN     "updateUrl" TEXT NOT NULL DEFAULT 'video_call_update';

-- AlterTable
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Media_id_key" ON "Media"("id");
