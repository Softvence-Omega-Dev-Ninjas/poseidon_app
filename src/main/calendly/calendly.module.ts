import { Module } from '@nestjs/common';
import { CalendlyController } from './calendly.controller';
import { CalendlyService } from './calendly.service';
import { CalendlyRepository } from './calendly.repository';
import { CalendlyWebhook } from './calendly.webhook';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { SchedulService } from './schedul.service';

@Module({
  imports: [PrismaClientModule],
  controllers: [CalendlyController],
  providers: [
    CalendlyRepository,
    CalendlyService,
    CalendlyWebhook,
    SchedulService,
  ],
  exports: [CalendlyService],
})
export class CalendlyModule {}
