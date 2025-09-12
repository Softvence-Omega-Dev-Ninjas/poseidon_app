-- DropForeignKey
ALTER TABLE "CalligSubscriptionPlan" DROP CONSTRAINT "CalligSubscriptionPlan_membershipSubscriptionPlanId_fkey";

-- DropForeignKey
ALTER TABLE "GallerySubscriptionPlan" DROP CONSTRAINT "GallerySubscriptionPlan_membershipSubscriptionPlanId_fkey";

-- DropForeignKey
ALTER TABLE "MessagesSubscriptionPlan" DROP CONSTRAINT "MessagesSubscriptionPlan_membershipSubscriptionPlanId_fkey";

-- DropForeignKey
ALTER TABLE "PostsSubscriptionPlan" DROP CONSTRAINT "PostsSubscriptionPlan_membershipSubscriptionPlanId_fkey";

-- AddForeignKey
ALTER TABLE "CalligSubscriptionPlan" ADD CONSTRAINT "CalligSubscriptionPlan_membershipSubscriptionPlanId_fkey" FOREIGN KEY ("membershipSubscriptionPlanId") REFERENCES "MembershipSubscriptionPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessagesSubscriptionPlan" ADD CONSTRAINT "MessagesSubscriptionPlan_membershipSubscriptionPlanId_fkey" FOREIGN KEY ("membershipSubscriptionPlanId") REFERENCES "MembershipSubscriptionPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GallerySubscriptionPlan" ADD CONSTRAINT "GallerySubscriptionPlan_membershipSubscriptionPlanId_fkey" FOREIGN KEY ("membershipSubscriptionPlanId") REFERENCES "MembershipSubscriptionPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsSubscriptionPlan" ADD CONSTRAINT "PostsSubscriptionPlan_membershipSubscriptionPlanId_fkey" FOREIGN KEY ("membershipSubscriptionPlanId") REFERENCES "MembershipSubscriptionPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
