import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { MailModule } from 'src/utils/mail/mail.module';

@Module({
  imports: [CloudinaryModule, PrismaClientModule, MailModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
