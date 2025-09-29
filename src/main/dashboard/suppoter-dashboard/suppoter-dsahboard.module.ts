import { Module } from '@nestjs/common';
import { ReferralController } from './suppoter-dsahboard.controller';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { ReferralService } from './suppoter-dsahboard.service';


@Module({
  controllers: [ReferralController],
  providers: [ReferralService, PrismaService],
  exports: [ReferralService],
})
export class ReferralModule {}
