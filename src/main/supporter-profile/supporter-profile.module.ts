import { Module } from '@nestjs/common';
import { SupporterProfileService } from './supporter-profile.service';
import { SupporterProfileController } from './supporter-profile.controller';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [ProductModule],
  controllers: [SupporterProfileController],
  providers: [SupporterProfileService],
})
export class SupporterProfileModule {}
