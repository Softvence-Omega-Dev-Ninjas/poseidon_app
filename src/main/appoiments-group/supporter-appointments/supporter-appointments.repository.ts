import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

/**
 *
 * Role -> USER | SUPPORTER
 *
 * Supporter -> Who provide service
 * User -> Who take service
 *
 */
@Injectable()
export class SupporterAppointmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createAppointment(input: CreateAppointmentDto, availability: any) {
    return await this.prisma.$transaction(async (tx) => {
      const supporter = await this.prisma.user.findUnique({
        where: { id: input.supporterId },
      });
      const user = await this.prisma.user.findUnique({
        where: { id: input.userId },
      });
      if (!supporter?.username || !user?.username)
        throw new NotFoundException('Supporter OR User information missmatch');

      const appt = await tx.appointment.create({
        data: {
          ...input,
          status: 'PENDING',
        },
        select: {
          user: true,
          supporter: true,
        },
      });

      await tx.userAvailability.update({
        where: { id: availability.id },
        data: { isBooked: true },
      });

      // send mail/notificaiton with anyhow to the supporter(bargirl) <-> a user request you to do video call

      // send mail/notificaiton with anyhow to the user <-> a request successfully send
      return appt;
    });
  }
}
