-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'SUPPORTERS');

-- CreateEnum
CREATE TYPE "Duration" AS ENUM ('ONE_MONTH', 'ONE_YEAR');

-- CreateEnum
CREATE TYPE "WhoCanSee" AS ENUM ('PUBLIC', 'ONLY_SUPPORTERS', 'ONLY_MEMBERS');

-- CreateEnum
CREATE TYPE "SuccessPage" AS ENUM ('message', 'redirect');

-- CreateEnum
CREATE TYPE "LayoutType" AS ENUM ('standard', 'suggest');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('admin', 'supporter', 'user');

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "mediaId" TEXT NOT NULL,
    "view" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImageLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImageComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imageId" TEXT,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "user1Id" TEXT NOT NULL,
    "user2Id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastMessageAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "drafted" BOOLEAN NOT NULL DEFAULT false,
    "images" TEXT[],
    "description" TEXT NOT NULL,
    "whoCanSee" "WhoCanSee" NOT NULL DEFAULT 'PUBLIC',
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "view" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shop" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "price" DOUBLE PRECISION NOT NULL,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "shopId" TEXT NOT NULL,
    "totalSales" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT[],
    "features" TEXT[],
    "offerPrice" DOUBLE PRECISION,
    "successPage" "SuccessPage" NOT NULL,
    "successPagefield" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCategoryOnProduct" (
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductCategoryOnProduct_pkey" PRIMARY KEY ("productId","categoryId")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postCode" TEXT,
    "apartmentOrHouse" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "paymentId" TEXT,
    "userId" TEXT,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupporterPay" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "massage" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupporterPay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oder_package_name" (
    "id" TEXT NOT NULL,
    "supporter_pay_id" TEXT NOT NULL,
    "package_name" VARCHAR(100) NOT NULL,
    "package_time" DOUBLE PRECISION NOT NULL,
    "package_price" DOUBLE PRECISION NOT NULL,
    "complate" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oder_package_name_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportCartLayout" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "choose_layout" "LayoutType" NOT NULL DEFAULT 'standard',
    "default_price" INTEGER NOT NULL DEFAULT 5
);

-- CreateTable
CREATE TABLE "Cheers_live_package_type" (
    "id" TEXT NOT NULL,
    "package_name" VARCHAR(100) NOT NULL,
    "package_time" DOUBLE PRECISION NOT NULL,
    "package_price" DOUBLE PRECISION NOT NULL,
    "support_cart_layout_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'credentials',
    "email" TEXT NOT NULL,
    "password" TEXT,
    "otp" TEXT,
    "varify" BOOLEAN NOT NULL DEFAULT false,
    "deactivate" BOOLEAN NOT NULL DEFAULT false,
    "role" "Roles" NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "address" TEXT,
    "state" TEXT,
    "city" TEXT,
    "country" TEXT,
    "postcode" TEXT,
    "cover_image" TEXT,
    "description" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_mediaId_key" ON "Image"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageLike_userId_imageId_key" ON "ImageLike"("userId", "imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Media_imageId_key" ON "Media"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_owner_ownerId_key" ON "Membership_owner"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "MembershipSubscriptionPlan_membershipLevelId_duration_key" ON "MembershipSubscriptionPlan"("membershipLevelId", "duration");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_postId_key" ON "Like"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_userId_key" ON "Shop"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SupporterPay_id_key" ON "SupporterPay"("id");

-- CreateIndex
CREATE UNIQUE INDEX "oder_package_name_id_key" ON "oder_package_name"("id");

-- CreateIndex
CREATE UNIQUE INDEX "oder_package_name_supporter_pay_id_key" ON "oder_package_name"("supporter_pay_id");

-- CreateIndex
CREATE UNIQUE INDEX "SupportCartLayout_id_key" ON "SupportCartLayout"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SupportCartLayout_author_id_key" ON "SupportCartLayout"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cheers_live_package_type_id_key" ON "Cheers_live_package_type"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userid_key" ON "Profile"("userid");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageLike" ADD CONSTRAINT "ImageLike_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageLike" ADD CONSTRAINT "ImageLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageComment" ADD CONSTRAINT "ImageComment_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageComment" ADD CONSTRAINT "ImageComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategoryOnProduct" ADD CONSTRAINT "ProductCategoryOnProduct_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategoryOnProduct" ADD CONSTRAINT "ProductCategoryOnProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupporterPay" ADD CONSTRAINT "SupporterPay_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupporterPay" ADD CONSTRAINT "SupporterPay_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oder_package_name" ADD CONSTRAINT "oder_package_name_supporter_pay_id_fkey" FOREIGN KEY ("supporter_pay_id") REFERENCES "SupporterPay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportCartLayout" ADD CONSTRAINT "SupportCartLayout_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cheers_live_package_type" ADD CONSTRAINT "Cheers_live_package_type_support_cart_layout_id_fkey" FOREIGN KEY ("support_cart_layout_id") REFERENCES "SupportCartLayout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
