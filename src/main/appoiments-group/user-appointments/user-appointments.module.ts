import { Module } from '@nestjs/common';
import { UserAppointmentsController } from './user-appointments.controller';
import { UserAppointmentsService } from './user-appointments.service';
import { AvaiabilityModule } from '../avaiability/avaiability.module';
import { AvailabilityRepository } from '../avaiability/avaiability.repository';

@Module({
  imports: [AvaiabilityModule],
  controllers: [UserAppointmentsController],
  providers: [AvailabilityRepository, UserAppointmentsService],
})
export class UserAppointmentsModule {}
