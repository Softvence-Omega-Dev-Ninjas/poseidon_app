import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';
import { GetShopDataService } from './supporter-profile-pass-data/getShopData.service';

@Module({
  imports: [PrismaClientModule, CloudinaryModule],
  controllers: [ProductController],
  providers: [ProductService, GetShopDataService],
  exports: [ProductService, GetShopDataService],
})
export class ProductModule {}
