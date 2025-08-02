import { Module } from '@nestjs/common';
import { SupporterProfileService } from './supporter-profile.service';
import { SupporterProfileController } from './supporter-profile.controller';
import { GetShopDataService } from './getShopData.service';
import { GetPostDataService } from './getPostData.service';

@Module({
  imports: [],
  controllers: [SupporterProfileController],
  providers: [SupporterProfileService, GetShopDataService, GetPostDataService],
})
export class SupporterProfileModule {}
