/*
  Warnings:

  - You are about to drop the column `AccessToPosts` on the `MembershipAccessToGallery` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MembershipAccessToGallery" DROP COLUMN "AccessToPosts",
ADD COLUMN     "AccessToGallery" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "MembershipAccessToPosts" ADD COLUMN     "AccessToPosts" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "MembershipSubscriptionPlan" ADD COLUMN     "membershipAccessToMessagesId" TEXT;

-- CreateTable
CREATE TABLE "MembershipAccessToMessages" (
    "id" TEXT NOT NULL,
    "membership_ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Messages Access',
    "description" TEXT DEFAULT 'Access to messages with the owner',
    "totalMessages" INTEGER NOT NULL DEFAULT 0,
    "unlimitedMessages" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MembershipAccessToMessages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MembershipSubscriptionPlan" ADD CONSTRAINT "MembershipSubscriptionPlan_membershipAccessToMessagesId_fkey" FOREIGN KEY ("membershipAccessToMessagesId") REFERENCES "MembershipAccessToMessages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipAccessToMessages" ADD CONSTRAINT "MembershipAccessToMessages_membership_ownerId_fkey" FOREIGN KEY ("membership_ownerId") REFERENCES "Membership_owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
