import { Module, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [PrismaClientModule, CloudinaryModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
