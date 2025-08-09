import { Module } from '@nestjs/common';
import { ChatGateway } from './message.getway';
import { RedisService } from './message.services';

@Module({
  providers: [ChatGateway, RedisService],
})
export class ChatModule {}
