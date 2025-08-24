import { HttpException, Injectable } from '@nestjs/common';
import { cResponseData } from 'src/common/utils/common-responseData';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class MediafileService {
  constructor(private readonly prisma: PrismaService) {}

  async findByMedia(id: string) {
    const data = await this.prisma.media.findFirst({
      where: {
        id,
      },
    });
    if (data && data.id)
      return cResponseData({
        message: 'Media file found successfully',
        data,
      });
    throw new HttpException(
      cResponseData({
        message: 'Media file not found',
        data: null,
      }),
      404,
    );
  }

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
