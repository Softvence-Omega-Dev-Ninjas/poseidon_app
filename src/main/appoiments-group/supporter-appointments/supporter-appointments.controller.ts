import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/auth/guard/public.decorator';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { SupporterAppointmentsService } from './supporter-appointments.service';

@Controller('supporter-appointments')
export class SupporterAppointmentsController {
  constructor(private readonly service: SupporterAppointmentsService) {}

  @ApiOperation({ summary: 'Request an appointment' })
  @Public()
  @Post()
  async request(@Body() body: CreateAppointmentDto) {
    try {
      const res = await this.service.requestAppointment(body);
      console.log(res);
      return 'hello';
    } catch (err) {
      return err;
    }
  }
}
