import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import {
  BuyMembershipDto,
  BuyMembershipResponseDto,
} from './dto/buyMembership.dto';
import { StripeService } from 'src/utils/stripe/stripe.service';
import { cResponseData } from 'src/common/utils/common-responseData';
import { PaymentInfoService } from './paymentDetails.service';
import { RefferEarningService } from 'src/utils/stripe/refferEarning.service';

@Injectable()
export class MembershipServiceUseToUserOnly {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
    private readonly paymentInfoService: PaymentInfoService,
    private readonly refferEarningService: RefferEarningService,
  ) {}

  async buyMembership(
    userId: string,
    membershipLevelInfo: BuyMembershipDto,
    buyforce: boolean,
  ) {
    const membershipLevel = await this.prisma.membership_levels.findFirst({
      where: { id: membershipLevelInfo.membershipLevelId },
      select: {
        id: true,
        titleName: true,
        membership: {
          select: {
            owner: {
              select: {
                id: true,
                stripeAccountId: true,
              },
            },
          },
        },
        MembershipSubscriptionPlan: {
          where: {
            duration: membershipLevelInfo.durationType,
          },
          include: {
            CalligSubscriptionPlan: true,
            MessagesSubscriptionPlan: true,
            GallerySubscriptionPlan: true,
            PostsSubscriptionPlan: true,
          },
        },
      },
    });

    if (
      membershipLevel?.id &&
      membershipLevel.MembershipSubscriptionPlan.length < 1
    ) {
      throw new HttpException(
        cResponseData({
          message: 'Membership level not found',
          error: 'Membership level not found',
          data: null,
          success: false,
        }),
        404,
      );
    }

    console.log({ membershipLevel });

    let endDate: Date = new Date();
    const plan = membershipLevel?.MembershipSubscriptionPlan[0]
      .duration as string;
    if (plan === 'ONE_MONTH') {
      endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan === 'ONE_YEAR') {
      endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // exaiting membership payment info
    const existingPaymentInfo =
      await this.paymentInfoService.existingBuyMembership({
        userId: userId,
        sellerId: membershipLevel?.membership.owner.id as string,
        serviceId: membershipLevel?.id as string,
      });

    // console.log('===== existingPaymentInfo ======', existingPaymentInfo);
    // console.log('===== buyforce >>>>>>>>>>>>>>>>>>>> ======', buyforce);
    const existingService = await this.prisma.membership_levels.findFirst({
      where: { id: existingPaymentInfo?.serviceId },
    });

    if (!buyforce && existingPaymentInfo && existingService?.id) {
      return {
        message: 'You already have this membership, Are you sure purchece this',
        error: null,
        data: null,
        buyforce: true,
        success: false,
      };
    }

    const plainAccess = membershipLevel?.MembershipSubscriptionPlan[0];
    // Defualt create payment info and status pending
    const payment_info = await this.prisma.paymentDetails.create({
      data: {
        buyerId: userId,
        sellerId: membershipLevel?.membership.owner.id as string,
        serviceName: membershipLevel?.titleName as string,
        amount: Number(membershipLevel?.MembershipSubscriptionPlan[0].price),
        serviceType: 'membership',
        paymemtStatus: 'pending',
        serviceId: membershipLevel?.id as string,
        endDate: endDate, // PK duration time
        PermissionVideoCallAccess: plainAccess?.CalligSubscriptionPlan
          ? {
              create: {
                user_id: userId,
                supporter_id: membershipLevel?.membership.owner.id as string,
                totalVideoCalls: membershipLevel?.MembershipSubscriptionPlan[0]
                  .CalligSubscriptionPlan?.totalVideoCalls as number,
                unlimitedVideoCalls: membershipLevel
                  ?.MembershipSubscriptionPlan[0].CalligSubscriptionPlan
                  ?.unlimitedVideoCalls as boolean,
              },
            }
          : undefined,
        PermissionMessagesAccess: plainAccess?.MessagesSubscriptionPlan
          ? {
              create: {
                user_id: userId,
                supporter_id: membershipLevel?.membership.owner.id as string,
                totalMessages: membershipLevel?.MembershipSubscriptionPlan[0]
                  .MessagesSubscriptionPlan?.totalMessages as number,
                unlimitedMessages: membershipLevel
                  ?.MembershipSubscriptionPlan[0].MessagesSubscriptionPlan
                  ?.unlimitedMessages as boolean,
              },
            }
          : undefined,
        PermissionGalleryAccess: plainAccess?.GallerySubscriptionPlan
          ? {
              create: {
                user_id: userId,
                supporter_id: membershipLevel?.membership.owner.id as string,
              },
            }
          : undefined,
        PermissionPostsAccess: plainAccess?.PostsSubscriptionPlan
          ? {
              create: {
                user_id: userId,
                supporter_id: membershipLevel?.membership.owner.id as string,
              },
            }
          : undefined,
      },
    });

    // return cResponseData({
    //   message: 'Membership payment info created successfully',
    //   data: payment_info,
    // });

    // // // payment checkout this function
    const checkout = await this.stripeService.checkOutPaymentSessionsMembership(
      {
        payment_info_id: payment_info.id,
        planDuration: plan,
        amount: Number(membershipLevel?.MembershipSubscriptionPlan[0].price),
        buyerId: userId,
        sellerId: membershipLevel?.membership.owner.id as string,
        serviceName: membershipLevel?.titleName as string,
        serviceType: 'membership',
        serviceId: membershipLevel?.id as string,
      },
    );

    console.log('membership - checkout', checkout);

    return cResponseData({
      message: 'Membership payment info created successfully',
      data: checkout,
      success: true,
    });
  }

  // payment status
  async paymentStatus(data: BuyMembershipResponseDto) {
    const payStatus = await this.stripeService.paymentIntentCheck(
      data.paymentIntentId,
    );
    if (!payStatus || payStatus.status !== 'succeeded') {
      throw new HttpException(
        cResponseData({
          message: 'Payment failed',
          error: 'Payment failed',
          data: null,
          success: false,
        }),
        400,
      );
    }
    // console.log('paymentIntent - pi checkout', payStatus);
    if (payStatus.status === 'succeeded') {
      const paymentIntentData = await this.prisma.paymentDetails.update({
        where: {
          id: payStatus.metadata.paymentDetails,
        },
        data: {
          paymemtStatus: 'paid',
        },
      });
      console.log('paymentIntentData = succeeded', paymentIntentData);

      if (paymentIntentData.sellerId) {
        await this.refferEarningService.refferEarningBySeller(
          paymentIntentData.sellerId,
          paymentIntentData.amount,
        );
      }

      return cResponseData({
        message: 'Payment successfully complated',
        data: paymentIntentData,
        success: true,
      });
    }
    if (payStatus.status === 'canceled') {
      const paymentIntent = await this.prisma.paymentDetails.update({
        where: {
          id: payStatus.metadata.paymentDetails,
        },
        data: {
          paymemtStatus: 'canceled',
        },
      });
      return cResponseData({
        message: 'payment canceled ',
        data: paymentIntent,
        success: false,
      });
    }
  }

  // get all membership levels use to user and suupoter
  async getMembershipLevels(mId: string) {
    return await this.prisma.$transaction(async (tx) => {
      const allLevels = await tx.membership_levels.findMany({
        where: {
          membershipId: mId,
          isPublic: true,
        },
        select: {
          id: true,
          membershipId: true,
          levelName: true,
          levelImage: true,
          levelDescription: true,
          isPublic: true,
          MembershipSubscriptionPlan: {
            select: {
              id: true,
              duration: true,
              price: true,
              CalligSubscriptionPlan: true,
              MessagesSubscriptionPlan: true,
              GallerySubscriptionPlan: true,
              PostsSubscriptionPlan: true,
            },
          },
        },
      });
      const imageIds = allLevels.map((level) => level.levelImage);
      // call media tb
      const imageurl = await tx.media.findMany({
        where: {
          id: {
            in: imageIds,
          },
        },
      });
      return cResponseData({
        message: 'Membership level created successfully',
        data:
          allLevels.map((level) => {
            const levelImage = imageurl.find(
              (image) => image.id === level.levelImage,
            );
            return {
              ...level,
              levelImage: levelImage ? levelImage : null,
            };
          }) || [],
        success: true,
      });
    });
  }

  //get single membership level use to user and suupoter
  async getLevels(levelId: string) {
    const level = await this.prisma.membership_levels.findUnique({
      where: {
        id: levelId,
        isPublic: true,
      },
      select: {
        id: true,
        membershipId: true,
        levelName: true,
        levelImage: true,
        levelDescription: true,
        MembershipSubscriptionPlan: {
          select: {
            id: true,
            duration: true,
            price: true,
            CalligSubscriptionPlan: true,
            MessagesSubscriptionPlan: true,
            GallerySubscriptionPlan: true,
            PostsSubscriptionPlan: true,
          },
        },
      },
    });
    const imageMedia = await this.prisma.media.findFirst({
      where: {
        id: level?.levelImage,
      },
    });
    return { ...level, levelImage: imageMedia };
  }

  async getVideoCallingList(userid: string) {
    const callingList = await this.prisma.permissionVideoCallAccess.findMany({
      where: {
        user_id: userid,
        paymentDetails: {
          paymemtStatus: 'paid',
          endDate: {
            gte: new Date(),
          },
        },
        OR: [{ unlimitedVideoCalls: true }, { totalVideoCalls: { gt: 0 } }],
      },
    });
    return cResponseData({
      message: 'Video calling list',
      data: callingList,
      success: true,
    });
  }
}
