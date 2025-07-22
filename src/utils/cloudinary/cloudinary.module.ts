import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.config';
import { CloudinaryService } from './cloudinary.service';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';

@Module({
  imports:[PrismaClientModule,],
  providers: [CloudinaryProvider, CloudinaryService,],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
