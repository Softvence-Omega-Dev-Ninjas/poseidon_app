import { Module } from '@nestjs/common';
import { VideoCallSchedulHistoryService } from './video-call-schedul-history.service';
import { VideoCallSchedulHistoryController } from './video-call-schedul-history.controller';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';

@Module({
  imports: [PrismaClientModule],
  controllers: [VideoCallSchedulHistoryController],
  providers: [VideoCallSchedulHistoryService],
})
export class VideoCallSchedulHistoryModule {}
