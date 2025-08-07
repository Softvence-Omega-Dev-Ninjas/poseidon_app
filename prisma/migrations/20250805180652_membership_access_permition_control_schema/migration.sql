-- CreateEnum
CREATE TYPE "Duration" AS ENUM ('ONE_MONTH', 'ONE_YEAR');

-- CreateTable
CREATE TABLE "Membership_owner" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership_levels" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "levelName" TEXT NOT NULL,
    "levelDescription" TEXT,
    "levelBenefits" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipSubscriptionPlan" (
    "id" TEXT NOT NULL,
    "membershipLevelId" TEXT NOT NULL,
    "duration" "Duration" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "membershipAccessToVideoCallId" TEXT,
    "membershipAccessGalleryId" TEXT,
    "membershipAccessToPostsId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MembershipSubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipAccessToVideoCall" (
    "id" TEXT NOT NULL,
    "membership_ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Video Call Access',
    "description" TEXT DEFAULT 'Access to video calls with the owner',
    "totalVideoCalls" INTEGER NOT NULL DEFAULT 0,
    "unlimitedVideoCalls" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MembershipAccessToVideoCall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipAccessToGallery" (
    "id" TEXT NOT NULL,
    "membership_ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Gallery Access',
    "description" TEXT NOT NULL DEFAULT 'Access to the gallery with the owner',
    "AccessToPosts" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MembershipAccessToGallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipAccessToPosts" (
    "id" TEXT NOT NULL,
    "membership_ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Posts Access',
    "description" TEXT NOT NULL DEFAULT 'Access to the posts with the owner',

    CONSTRAINT "MembershipAccessToPosts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Membership_owner_ownerId_key" ON "Membership_owner"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "MembershipSubscriptionPlan_membershipLevelId_duration_key" ON "MembershipSubscriptionPlan"("membershipLevelId", "duration");

-- AddForeignKey
ALTER TABLE "Membership_owner" ADD CONSTRAINT "Membership_owner_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership_levels" ADD CONSTRAINT "Membership_levels_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership_owner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipSubscriptionPlan" ADD CONSTRAINT "MembershipSubscriptionPlan_membershipLevelId_fkey" FOREIGN KEY ("membershipLevelId") REFERENCES "Membership_levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipSubscriptionPlan" ADD CONSTRAINT "MembershipSubscriptionPlan_membershipAccessToVideoCallId_fkey" FOREIGN KEY ("membershipAccessToVideoCallId") REFERENCES "MembershipAccessToVideoCall"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipSubscriptionPlan" ADD CONSTRAINT "MembershipSubscriptionPlan_membershipAccessGalleryId_fkey" FOREIGN KEY ("membershipAccessGalleryId") REFERENCES "MembershipAccessToGallery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipSubscriptionPlan" ADD CONSTRAINT "MembershipSubscriptionPlan_membershipAccessToPostsId_fkey" FOREIGN KEY ("membershipAccessToPostsId") REFERENCES "MembershipAccessToPosts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipAccessToVideoCall" ADD CONSTRAINT "MembershipAccessToVideoCall_membership_ownerId_fkey" FOREIGN KEY ("membership_ownerId") REFERENCES "Membership_owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipAccessToGallery" ADD CONSTRAINT "MembershipAccessToGallery_membership_ownerId_fkey" FOREIGN KEY ("membership_ownerId") REFERENCES "Membership_owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipAccessToPosts" ADD CONSTRAINT "MembershipAccessToPosts_membership_ownerId_fkey" FOREIGN KEY ("membership_ownerId") REFERENCES "Membership_owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
