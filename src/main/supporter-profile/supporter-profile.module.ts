import { Module } from '@nestjs/common';
import { SupporterProfileService } from './supporter-profile.service';
import { SupporterProfileController } from './supporter-profile.controller';
import { GetShopDataService } from './getShopData.service';
import { GetPostDataService } from './getPostData.service';
import { CoverPhotoChangeService } from './coverPhotoChange.service';
import { MediafileModule } from '../mediafile/mediafile.module';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
// import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';

@Module({
  imports: [MediafileModule, PrismaClientModule],
  controllers: [SupporterProfileController],
  providers: [
    SupporterProfileService,
    GetShopDataService,
    GetPostDataService,
    CoverPhotoChangeService,
  ],
})
export class SupporterProfileModule {}
