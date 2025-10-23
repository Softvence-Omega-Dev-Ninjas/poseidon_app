import { Injectable } from '@nestjs/common';
import { cResponseData } from 'src/common/utils/common-responseData';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class VideoCallChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getVideoCallChatList(userid: string) {
    const userinfo = await this.prisma.user.findFirst({
      where: { id: userid },
      select: { id: true, email: true },
    });

    if (userinfo && userinfo.email) {
      const payList = await this.prisma.paymentDetails.findMany({
        where: {
          buyerId: null,
          email: userinfo.email,
          paymemtStatus: 'paid',
        },
        select: {
          id: true,
        },
      });
      await Promise.all(
        payList.map(async (updateItem) => {
          const rewardUpdaID = await this.prisma.paymentDetails.update({
            where: { id: updateItem.id },
            data: { buyerId: userinfo.id },
          });
          await this.prisma.permissionVideoCallAccess.update({
            where: { paymentId: rewardUpdaID.id },
            data: { user_id: userinfo.id },
          });
          await this.prisma.permissionMessagesAccess.update({
            where: { paymentId: rewardUpdaID.id },
            data: { user_id: userinfo.id },
          });
          await this.prisma.permissionGalleryAccess.update({
            where: { paymentId: rewardUpdaID.id },
            data: { user_id: userinfo.id },
          });
          await this.prisma.permissionPostsAccess.update({
            where: { paymentId: rewardUpdaID.id },
            data: { user_id: userinfo.id },
          });
        }),
      );
    }

    const data = await this.prisma.permissionVideoCallAccess.findMany({
      where: {
        user_id: userid,
        paymentDetails: {
          paymemtStatus: 'paid',
        },
        OR: [{ unlimitedVideoCalls: true }, { totalVideoCalls: { gt: 0 } }],
      },
      include: {
        paymentDetails: true,
        supporter: {
          select: {
            id: true,
            username: true,
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
      message: 'Video calling list - membership',
      data: addUrlQure,
      success: true,
    });
  }

  async getVideoCallSchedul(userid: string) {
    const userEmailByid = await this.prisma.user.findFirst({
      where: {
        id: userid,
      },
      select: { email: true },
    });

    // const
    console.log('userEmailByid getVideoCallSchedul =>>>>>>', userEmailByid);

    if (userEmailByid && userEmailByid.email) {
      const list = await this.prisma.scheduledEvent.findMany();

      console.log('list =>>>>>> getVideoCallSchedul =====>>>> null', list);

      await this.prisma.scheduledEvent.updateMany({
        where: {
          utm_term_userId: null,
          email: userEmailByid.email,
          end_time: {
            gt: new Date(),
          },
        },
        data: {
          utm_term_userId: userid,
        },
      });
    }

    const getCallSchedul = await this.prisma.scheduledEvent.findMany({
      where: {
        utm_term_userId: userid,
        end_time: {
          gt: new Date(),
        },
      },
      include: {
        bergirl: {
          select: {
            id: true,
            username: true,
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

    console.log(
      'getCallSchedul =>>>>>>=======???????????------->',
      getCallSchedul,
    );
    return cResponseData({
      message: 'Video calling Schedul',
      data: getCallSchedul,
      success: true,
    });
  }

  async scheduledEventLists() {
    const webhook = await this.prisma.scheduledEvent.findMany();
    const suppcard = await this.prisma.supporterPay.findMany({
      where: { user_id: null },
    });

    return {
      webhook,
      suppcard,
    };
  }

  // async getAllVideoCallSchedul() {
  //   const getCallSchedul = await this.prisma.scheduledEvent.findMany({
  //     include: {
  //       bergirl: {
  //         select: {
  //           profile: {
  //             select: {
  //               name: true,
  //               image: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //     orderBy: {
  //       start_time: 'desc',
  //     },
  //   });

  //   console.log('getCallSchedul =>>>>>>', getCallSchedul);
  //   return cResponseData({
  //     message: 'Video calling Schedul',
  //     data: getCallSchedul,
  //     success: true,
  //   });
  // }

  async getVideoCallSingleData(id: string) {
    const getCallSchedul = await this.prisma.scheduledEvent.findUnique({
      where: {
        id: id,
      },
      include: {
        bergirl: {
          select: {
            id: true,
            username: true,
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
            id: true,
            username: true,
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

  // get VideoCallSchedul ServiceOrder
  async getVideoCallSchedulServiceOrder(userid: string) {
    const userInfo = await this.prisma.user.findFirst({
      where: {
        id: userid,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (userInfo && userInfo.email && userInfo.id) {
      await this.prisma.serviceOrder.updateMany({
        where: {
          userId: null,
          paymentDetails: {
            paymemtStatus: 'paid',
          },
          email: userInfo.email,
        },
        data: {
          userId: userInfo.id,
        },
      });
    }

    const getCallSchedul = await this.prisma.serviceOrder.findMany({
      where: {
        userId: userid,
        paymentDetails: {
          paymemtStatus: 'paid',
        },
        scheduledEvent: { is: null },
      },
      include: {
        paymentDetails: true,
        service: true,
        seller: {
          select: {
            id: true,
            username: true,
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
        createdAt: 'desc',
      },
    });

    //   utm_source -> membership / service / supportercard
    //   utm_medium -> id
    //   utm_term -> userId
    //   salesforce_uuid -> bergirlId

    const setUrlCallSchedul = getCallSchedul.map((item) => {
      return {
        ...item,
        scheduling_url: `${item.scheduling_url}?utm_term=${item.userId}&salesforce_uuid=${item.sellerId}&utm_medium=${item.id}&utm_source=${'service'}`,
      };
    });
    return cResponseData({
      message: 'Video calling Schedul by ServiceOrder',
      data: setUrlCallSchedul,
      success: true,
    });
  }

  async drinksCheersLive(userId: string) {
    const userEmail = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        email: true,
      },
    });

    if (userEmail && userEmail.email) {
      await this.prisma.supporterPay.updateMany({
        where: {
          user_id: null,
          paymemtStatus: 'paid',
          email: userEmail.email,
        },
        data: {
          user_id: userId,
        },
      });
    }

    const supporter = await this.prisma.supporterPay.findMany({
      where: {
        paymemtStatus: 'paid',
        user_id: userId,
        oder_package_name: {
          isNot: null,
        },
        scheduledEvent: {
          is: null,
        },
      },
      include: {
        oder_package_name: true,
        author: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });
    return cResponseData({
      message: 'drinksCheersLive',
      data: supporter,
      success: true,
    });
  }
}
