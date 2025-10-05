import { Module } from '@nestjs/common';
import { SupporterAppointmentsModule } from './supporter-appointments/supporter-appointments.module';
import { UserAppointmentsModule } from './user-appointments/user-appointments.module';
import { AvaiabilityModule } from './avaiability/avaiability.module';

@Module({
  imports: [
    SupporterAppointmentsModule,
    UserAppointmentsModule,
    AvaiabilityModule,
  ],
  providers: [],
  exports: [],
})
export class AppoinmentGroupModule {}
