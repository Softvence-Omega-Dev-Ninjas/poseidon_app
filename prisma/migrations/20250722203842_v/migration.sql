/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `Image` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mediaId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,imageId]` on the table `ImageLike` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[imageId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mediaId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "imageUrl",
DROP COLUMN "publicId",
ADD COLUMN     "commentCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "mediaId" TEXT NOT NULL,
ADD COLUMN     "view" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "imageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Image_mediaId_key" ON "Image"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageLike_userId_imageId_key" ON "ImageLike"("userId", "imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Media_imageId_key" ON "Media"("imageId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
