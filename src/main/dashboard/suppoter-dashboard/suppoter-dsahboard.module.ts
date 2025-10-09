import { Module } from '@nestjs/common';
import { ReferralController } from './suppoter-dsahboard.controller';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { ReferralService } from './suppoter-dsahboard.service';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { VideoCallChatService } from './videocall.service';

@Module({
  imports: [PrismaClientModule],
  controllers: [ReferralController],
  providers: [ReferralService, PrismaService, VideoCallChatService],
  exports: [ReferralService, VideoCallChatService],
})
export class SuppoterModule {}
