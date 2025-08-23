import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class MediafileService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const data = await this.prisma.media.findUnique({
      where: {
        id,
      },
    });
    return data;
  }

  async deleteFile(id: string) {
    const deleteData = await this.prisma.media.delete({
      where: {
        id,
      },
    });
    return deleteData;
  }
}
