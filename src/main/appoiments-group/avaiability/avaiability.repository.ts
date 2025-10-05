import { Injectable } from '@nestjs/common';
import { PrismaTx } from 'src/@types';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class AvailabilityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findSlot(userId: string, time: Date) {
    return await this.prisma.doctorAvailability.findFirst({
      where: {
        userId,
        startTime: { lte: time },
        endTime: { gte: time },
        isBooked: false,
      },
    });
  }

  async markBooked(tx: PrismaTx, availabilityId: string, booked = true) {
    return tx.userAvailability.update({
      where: { id: availabilityId },
      data: { isBooked: booked },
    });
  }
}
