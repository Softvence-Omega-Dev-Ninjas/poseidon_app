import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { MailModule } from 'src/utils/mail/mail.module';

@Module({
  imports: [PrismaClientModule, MailModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
