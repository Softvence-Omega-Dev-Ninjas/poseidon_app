import { Module } from '@nestjs/common';
import { MediafileController } from './mediafile.controller';
import { MediafileService } from './mediafile.service';
import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [MediafileController],
  providers: [MediafileService],
  exports: [MediafileService],
})
export class MediafileModule {}
