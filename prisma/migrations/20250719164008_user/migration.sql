-- CreateEnum
CREATE TYPE "SuccessPage" AS ENUM ('message', 'redirect');

-- CreateEnum
CREATE TYPE "LayoutType" AS ENUM ('standard', 'suggest');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'supporter', 'user');

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
    "price" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "shopId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "totalSales" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT[],
    "features" TEXT[],
    "offerPrice" TEXT NOT NULL,
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
    "role" "Role" NOT NULL DEFAULT 'user',

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
    "postcode" TEXT
);

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
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupporterPay" ADD CONSTRAINT "SupporterPay_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupporterPay" ADD CONSTRAINT "SupporterPay_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oder_package_name" ADD CONSTRAINT "oder_package_name_supporter_pay_id_fkey" FOREIGN KEY ("supporter_pay_id") REFERENCES "SupporterPay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportCartLayout" ADD CONSTRAINT "SupportCartLayout_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cheers_live_package_type" ADD CONSTRAINT "Cheers_live_package_type_support_cart_layout_id_fkey" FOREIGN KEY ("support_cart_layout_id") REFERENCES "SupportCartLayout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
