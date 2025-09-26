import { Module } from '@nestjs/common';
import { MemberListMessageService } from './member-list-message.service';
import { MemberListMessageController } from './member-list-message.controller';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';

@Module({
  imports: [PrismaClientModule],
  controllers: [MemberListMessageController],
  providers: [MemberListMessageService],
})
export class MemberListMessageModule {}
