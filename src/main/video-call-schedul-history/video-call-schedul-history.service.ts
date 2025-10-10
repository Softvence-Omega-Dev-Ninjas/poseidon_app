import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { cResponseData } from 'src/common/utils/common-responseData';

@Injectable()
export class VideoCallSchedulHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(bergirlid: string) {
    const getCallSchedul = await this.prisma.scheduledEvent.findMany({
      where: {
        salesforce_uuid_bergirlId: bergirlid,
        end_time: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            profile: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        start_time: 'desc',
      },
    });
    return cResponseData({
      message: 'Video calling Schedul',
      data: getCallSchedul,
      success: true,
    });
  }

  async findOne(id: string) {
    const getCallSchedul = await this.prisma.scheduledEvent.findUnique({
      where: {
        id: id,
      },
      include: {
        bergirl: {
          select: {
            profile: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        user: {
          select: {
            profile: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        membershipVideoCallAccessTb: true,
        serviceOrderTb: true,
      },
    });
    return cResponseData({
      message: 'Video calling Schedul',
      data: { ...getCallSchedul, join_url: '' },
      success: true,
    });
  }
}
