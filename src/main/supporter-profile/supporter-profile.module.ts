import { Module } from '@nestjs/common';
import { SupporterProfileService } from './supporter-profile.service';
import { SupporterProfileController } from './supporter-profile.controller';

@Module({
  controllers: [SupporterProfileController],
  providers: [SupporterProfileService],
})
export class SupporterProfileModule {}
