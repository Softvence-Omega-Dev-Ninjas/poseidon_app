import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { ZoomController } from './zoom.controller';
import { ZoomService } from './zoom.service';


@Module({
  imports: [ConfigModule],
  controllers: [ZoomController],
  providers: [ZoomService],
})
export class ZoomModule {}
