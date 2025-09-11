import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { ZoomController } from './zoom.controller';
import { ZoomService } from './zoom.service';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';

@Module({
  imports: [ConfigModule, PrismaClientModule],
  controllers: [ZoomController],
  providers: [ZoomService],
})
export class ZoomModule {}
