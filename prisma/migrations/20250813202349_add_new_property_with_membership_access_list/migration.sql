/*
  Warnings:

  - You are about to drop the column `levelBenefits` on the `Membership_levels` table. All the data in the column will be lost.
  - Added the required column `duration` to the `MembershipAccessToGallery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `MembershipAccessToMessages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `MembershipAccessToPosts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `MembershipAccessToVideoCall` table without a default value. This is not possible if the table is not empty.
  - Added the required column `levelImage` to the `Membership_levels` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MembershipAccessToGallery" ADD COLUMN     "duration" "Duration" NOT NULL;

-- AlterTable
ALTER TABLE "MembershipAccessToMessages" ADD COLUMN     "duration" "Duration" NOT NULL;

-- AlterTable
ALTER TABLE "MembershipAccessToPosts" ADD COLUMN     "duration" "Duration" NOT NULL;

-- AlterTable
ALTER TABLE "MembershipAccessToVideoCall" ADD COLUMN     "duration" "Duration" NOT NULL;

-- AlterTable
ALTER TABLE "Membership_levels" DROP COLUMN "levelBenefits",
ADD COLUMN     "levelImage" TEXT NOT NULL;
