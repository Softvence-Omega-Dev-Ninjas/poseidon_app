import { Module } from '@nestjs/common';
import { ChatGateway } from './message.getway';
import { RedisService } from './message.services';
import { MemberListMessageModule } from './member-list-message/member-list-message.module';

@Module({
  providers: [ChatGateway, RedisService],
  imports: [MemberListMessageModule],
})
export class ChatModule {}
