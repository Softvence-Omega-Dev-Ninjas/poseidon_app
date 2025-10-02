import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsRepository } from './uploads.repository';
import { CloudinaryService } from './cloudinaryService';
import { CloudinaryProvider } from 'src/utils/cloudinary/cloudinary.config';
import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [UploadsController],
  providers: [CloudinaryProvider, UploadsRepository, CloudinaryService],
})
export class UploadsModule {}
