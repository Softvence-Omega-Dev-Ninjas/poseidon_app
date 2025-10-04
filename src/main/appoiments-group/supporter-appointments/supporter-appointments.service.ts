import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AvailabilityRepository } from '../avaiability/avaiability.repository';
import { SupporterAppointmentsRepository } from './supporter-appointments.repository';

@Injectable()
export class SupporterAppointmentsService {
  constructor(
    private readonly availabilityRepo: AvailabilityRepository,
    private readonly repository: SupporterAppointmentsRepository,
  ) {}

  async requestAppointment(input: CreateAppointmentDto) {
    if (!input.userId) throw new NotFoundException('User id is required');

    const requestedTime = new Date(input.requestedTime);
    // find available slot
    const availability = await this.availabilityRepo.findSlot(
      input.userId,
      requestedTime,
    );
    if (!availability) {
      throw new BadRequestException('Bar girl not available at requested time');
    }

    // create appointment + mark slot booked
    const result = await this.repository.createAppointment(input, availability);
    console.log(result);
  }
}
