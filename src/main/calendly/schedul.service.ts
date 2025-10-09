import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class SchedulService {
  constructor(private readonly prisma: PrismaService) {}

  async setSchedulSystem(data: any) {
    return await this.prisma.scheduledEvent.create({
      data: data,
    });
  }
}
