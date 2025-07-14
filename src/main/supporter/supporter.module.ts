import { Module } from '@nestjs/common';
import { SupporterService } from './supporter.service';
import { SupporterController } from './supporter.controller';

@Module({
  controllers: [SupporterController],
  providers: [SupporterService],
})
export class SupporterModule {}
