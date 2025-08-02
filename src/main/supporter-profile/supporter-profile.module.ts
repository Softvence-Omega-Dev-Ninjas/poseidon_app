import { Module } from '@nestjs/common';
import { SupporterProfileService } from './supporter-profile.service';
import { SupporterProfileController } from './supporter-profile.controller';
import { GetShopDataService } from './getShopData.service';

@Module({
  imports: [],
  controllers: [SupporterProfileController],
  providers: [SupporterProfileService, GetShopDataService],
})
export class SupporterProfileModule {}
