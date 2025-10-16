import { Module } from '@nestjs/common';
import { ChatGateway } from './message.getway';
import { RedisService } from './message.services';
import { MemberListMessageModule } from './member-list-message/member-list-message.module';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';

@Module({
  providers: [ChatGateway, RedisService],
  imports: [MemberListMessageModule, PrismaClientModule],
})
export class ChatModule {}
