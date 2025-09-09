-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('membership', 'support');

-- CreateTable
CREATE TABLE "paymentDetails" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "paymentDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "paymentDetails_id_key" ON "paymentDetails"("id");
