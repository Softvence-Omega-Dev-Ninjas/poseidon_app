-- CreateTable
CREATE TABLE "SupporterPay" (
    "id" TEXT NOT NULL,
    "supporter_id" TEXT,
    "author_id" TEXT NOT NULL,
    "Transaction_id" TEXT NOT NULL,
    "total_pay" DOUBLE PRECISION NOT NULL,
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
    "choose_layout" TEXT NOT NULL DEFAULT 'standard',
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

-- AddForeignKey
ALTER TABLE "SupporterPay" ADD CONSTRAINT "SupporterPay_supporter_id_fkey" FOREIGN KEY ("supporter_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupporterPay" ADD CONSTRAINT "SupporterPay_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oder_package_name" ADD CONSTRAINT "oder_package_name_supporter_pay_id_fkey" FOREIGN KEY ("supporter_pay_id") REFERENCES "SupporterPay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportCartLayout" ADD CONSTRAINT "SupportCartLayout_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cheers_live_package_type" ADD CONSTRAINT "Cheers_live_package_type_support_cart_layout_id_fkey" FOREIGN KEY ("support_cart_layout_id") REFERENCES "SupportCartLayout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
