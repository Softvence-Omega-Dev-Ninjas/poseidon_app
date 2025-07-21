import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';

@Module({
  imports: [PrismaClientModule],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
