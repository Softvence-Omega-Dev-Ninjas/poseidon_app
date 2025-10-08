import { Module } from '@nestjs/common';
import { CalendlyController } from './calendly.controller';
import { CalendlyService } from './calendly.service';
import { CalendlyRepository } from './calendly.repository';
import { CalendlyWebhook } from './calendly.webhook';

@Module({
  imports: [],
  controllers: [CalendlyController],
  providers: [CalendlyRepository, CalendlyService, CalendlyWebhook],
  exports: [CalendlyService],
})
export class CalendlyModule {}
