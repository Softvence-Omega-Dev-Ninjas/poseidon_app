-- DropIndex
DROP INDEX "oder_package_name_id_key";

-- CreateTable
CREATE TABLE "SupportCartLayoutQuantity" (
    "id" TEXT NOT NULL,
    "supportCartLayoutId" TEXT NOT NULL,
    "choose_layout" "LayoutType" NOT NULL DEFAULT 'suggest',
    "Quantity" INTEGER NOT NULL,

    CONSTRAINT "SupportCartLayoutQuantity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SupportCartLayoutQuantity_id_key" ON "SupportCartLayoutQuantity"("id");

-- AddForeignKey
ALTER TABLE "SupportCartLayoutQuantity" ADD CONSTRAINT "SupportCartLayoutQuantity_supportCartLayoutId_fkey" FOREIGN KEY ("supportCartLayoutId") REFERENCES "SupportCartLayout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
