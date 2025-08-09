import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';

@Module({
  imports: [PrismaClientModule, CloudinaryModule],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
