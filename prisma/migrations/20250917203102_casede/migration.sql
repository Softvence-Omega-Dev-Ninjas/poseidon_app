-- DropForeignKey
ALTER TABLE "ProductCategoryOnProduct" DROP CONSTRAINT "ProductCategoryOnProduct_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "ProductCategoryOnProduct" ADD CONSTRAINT "ProductCategoryOnProduct_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
