import { Module } from '@nestjs/common';
import { CalendlyController } from './calendly.controller';
import { CalendlyService } from './calendly.service';
import { CalendlyRepository } from './calendly.repository';

@Module({
  imports: [],
  controllers: [CalendlyController],
  providers: [CalendlyRepository, CalendlyService],
  exports: [],
})
export class CalendlyModule {}
