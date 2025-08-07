import { Module } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryController } from './product-category.controller';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';

@Module({
  imports: [PrismaClientModule ,CloudinaryModule],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService],
  exports: [ProductCategoryService],
})
export class ProductCategoryModule {}
