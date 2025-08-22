/*
  Warnings:

  - You are about to drop the column `membershipAccessGalleryId` on the `MembershipSubscriptionPlan` table. All the data in the column will be lost.
  - You are about to drop the column `membershipAccessToMessagesId` on the `MembershipSubscriptionPlan` table. All the data in the column will be lost.
  - You are about to drop the column `membershipAccessToPostsId` on the `MembershipSubscriptionPlan` table. All the data in the column will be lost.
  - You are about to drop the column `membershipAccessToVideoCallId` on the `MembershipSubscriptionPlan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MembershipSubscriptionPlan" DROP CONSTRAINT "MembershipSubscriptionPlan_membershipAccessGalleryId_fkey";

-- DropForeignKey
ALTER TABLE "MembershipSubscriptionPlan" DROP CONSTRAINT "MembershipSubscriptionPlan_membershipAccessToMessagesId_fkey";

-- DropForeignKey
ALTER TABLE "MembershipSubscriptionPlan" DROP CONSTRAINT "MembershipSubscriptionPlan_membershipAccessToPostsId_fkey";

-- DropForeignKey
ALTER TABLE "MembershipSubscriptionPlan" DROP CONSTRAINT "MembershipSubscriptionPlan_membershipAccessToVideoCallId_fkey";

-- AlterTable
ALTER TABLE "MembershipSubscriptionPlan" DROP COLUMN "membershipAccessGalleryId",
DROP COLUMN "membershipAccessToMessagesId",
DROP COLUMN "membershipAccessToPostsId",
DROP COLUMN "membershipAccessToVideoCallId";

-- CreateTable
CREATE TABLE "CalligSubscriptionPlan" (
    "id" TEXT NOT NULL,
    "membershipSubscriptionPlanId" TEXT NOT NULL,
    "duration" "Duration" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "totalVideoCalls" INTEGER NOT NULL DEFAULT 0,
    "unlimitedVideoCalls" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CalligSubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessagesSubscriptionPlan" (
    "id" TEXT NOT NULL,
    "membershipSubscriptionPlanId" TEXT NOT NULL,
    "duration" "Duration" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "totalMessages" INTEGER NOT NULL DEFAULT 0,
    "unlimitedMessages" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MessagesSubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GallerySubscriptionPlan" (
    "id" TEXT NOT NULL,
    "membershipSubscriptionPlanId" TEXT NOT NULL,
    "duration" "Duration" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "AccessToGallery" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "GallerySubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostsSubscriptionPlan" (
    "id" TEXT NOT NULL,
    "membershipSubscriptionPlanId" TEXT NOT NULL,
    "duration" "Duration" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "AccessToPosts" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PostsSubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CalligSubscriptionPlan_id_key" ON "CalligSubscriptionPlan"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CalligSubscriptionPlan_membershipSubscriptionPlanId_key" ON "CalligSubscriptionPlan"("membershipSubscriptionPlanId");

-- CreateIndex
CREATE UNIQUE INDEX "MessagesSubscriptionPlan_id_key" ON "MessagesSubscriptionPlan"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MessagesSubscriptionPlan_membershipSubscriptionPlanId_key" ON "MessagesSubscriptionPlan"("membershipSubscriptionPlanId");

-- CreateIndex
CREATE UNIQUE INDEX "GallerySubscriptionPlan_id_key" ON "GallerySubscriptionPlan"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GallerySubscriptionPlan_membershipSubscriptionPlanId_key" ON "GallerySubscriptionPlan"("membershipSubscriptionPlanId");

-- CreateIndex
CREATE UNIQUE INDEX "PostsSubscriptionPlan_id_key" ON "PostsSubscriptionPlan"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PostsSubscriptionPlan_membershipSubscriptionPlanId_key" ON "PostsSubscriptionPlan"("membershipSubscriptionPlanId");

-- AddForeignKey
ALTER TABLE "CalligSubscriptionPlan" ADD CONSTRAINT "CalligSubscriptionPlan_membershipSubscriptionPlanId_fkey" FOREIGN KEY ("membershipSubscriptionPlanId") REFERENCES "MembershipSubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessagesSubscriptionPlan" ADD CONSTRAINT "MessagesSubscriptionPlan_membershipSubscriptionPlanId_fkey" FOREIGN KEY ("membershipSubscriptionPlanId") REFERENCES "MembershipSubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GallerySubscriptionPlan" ADD CONSTRAINT "GallerySubscriptionPlan_membershipSubscriptionPlanId_fkey" FOREIGN KEY ("membershipSubscriptionPlanId") REFERENCES "MembershipSubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsSubscriptionPlan" ADD CONSTRAINT "PostsSubscriptionPlan_membershipSubscriptionPlanId_fkey" FOREIGN KEY ("membershipSubscriptionPlanId") REFERENCES "MembershipSubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
