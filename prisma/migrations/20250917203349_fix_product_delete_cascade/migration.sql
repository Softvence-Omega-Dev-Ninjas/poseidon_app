-- DropForeignKey
ALTER TABLE "ProductCategoryOnProduct" DROP CONSTRAINT "ProductCategoryOnProduct_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductCategoryOnProduct" DROP CONSTRAINT "ProductCategoryOnProduct_productId_fkey";

-- AddForeignKey
ALTER TABLE "ProductCategoryOnProduct" ADD CONSTRAINT "ProductCategoryOnProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategoryOnProduct" ADD CONSTRAINT "ProductCategoryOnProduct_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
