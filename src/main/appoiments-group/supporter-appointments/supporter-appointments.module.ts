import { Module } from '@nestjs/common';
import { SupporterAppointmentsService } from './supporter-appointments.service';
import { SupporterAppointmentsController } from './supporter-appointments.controller';
import { SupporterAppointmentsRepository } from './supporter-appointments.repository';
import { AvaiabilityModule } from '../avaiability/avaiability.module';
import { AvailabilityRepository } from '../avaiability/avaiability.repository';

@Module({
  imports: [AvaiabilityModule],
  providers: [
    AvailabilityRepository,
    SupporterAppointmentsRepository,
    SupporterAppointmentsService,
  ],
  controllers: [SupporterAppointmentsController],
})
export class SupporterAppointmentsModule {}
