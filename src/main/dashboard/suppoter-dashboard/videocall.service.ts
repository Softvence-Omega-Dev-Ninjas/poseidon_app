import { Injectable } from '@nestjs/common';
import { cResponseData } from 'src/common/utils/common-responseData';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class VideoCallChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getVideoCallChatList(userid: string) {
    const data = await this.prisma.permissionVideoCallAccess.findMany({
      where: {
        user_id: userid,
        paymentDetails: {
          paymemtStatus: 'paid',
        },
        OR: [{ unlimitedVideoCalls: true }, { totalVideoCalls: { gt: 0 } }],
      },
      include: {
        paymentDetails: {
          select: {
            endDate: true,
          },
        },
      },
      orderBy: {
        paymentDetails: {
          endDate: 'desc',
        },
      },
    });

    //   utm_campaign
    //   utm_source -> membership / service / supportercard
    //   utm_medium -> id
    //   utm_content
    //   utm_term -> userId
    //   salesforce_uuid -> bergirlId

    const addUrlQure = data.map((item) => {
      return {
        ...item,
        scheduling_url: `${item.scheduling_url}?utm_term=${item.user_id}&salesforce_uuid=${item.supporter_id}&utm_medium=${item.id}&utm_source=${'membership'}`,
        active:
          item.paymentDetails.endDate > new Date() &&
          (item.totalVideoCalls > 0 || item.unlimitedVideoCalls),
      };
    });

    return cResponseData({
      message: 'Video calling list',
      data: addUrlQure,
      success: true,
    });
  }

  async getVideoCallSchedul(userid: string) {
    const getCallSchedul = await this.prisma.scheduledEvent.findMany({
      where: {
        utm_term_userId: userid,
        end_time: {
          gt: new Date(),
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
}
