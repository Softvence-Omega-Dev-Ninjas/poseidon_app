import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { BuyMembershipDto } from './dto/buyMembership.dto';
import { StripeService } from 'src/utils/stripe/stripe.service';
import { cResponseData } from 'src/common/utils/common-responseData';
import { PaymentInfoService } from './paymentDetails.service';

@Injectable()
export class MembershipServiceUseToUserOnly {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
    private readonly paymentInfoService: PaymentInfoService,
  ) {}

  async buyMembership(userId: string, membershipLevelInfo: BuyMembershipDto) {
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
    // const existingPaymentInfo =
    //   await this.paymentInfoService.existingBuyMembership({
    //     userId: userId,
    //     sellerId: membershipLevel?.membership.owner.id as string,
    //     serviceId: membershipLevel?.id as string,
    //   });

    const plainAccess = membershipLevel?.MembershipSubscriptionPlan[0];
    // Defualt create payment info and status pending
    const payment_info = await this.prisma.paymentDetails.create({
      data: {
        buyerId: userId,
        sellerId: membershipLevel?.membership.owner.id as string,
        serviceName: membershipLevel?.titleName as string,
        amount: Number(membershipLevel?.MembershipSubscriptionPlan[0].price),
        serviceType: 'membership',
        serviceId: membershipLevel?.id as string,
        endDate: endDate,
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

    // payment checkout this function
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

    return {
      message: 'Membership bought successfully',
      redirect_url: checkout.url,
      data: checkout.id,
      success: true,
    };
    // return cResponseData({
    //   message: 'Membership bought successfully',
    //   data: {
    //     userId,
    //     membershipLevel: {
    //       ...membershipLevel,
    //       MembershipSubscriptionPlan:
    //         membershipLevel?.MembershipSubscriptionPlan[0],
    //     },
    //   },
    //   success: true,
    // });
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
    return await this.prisma.membership_levels.findUnique({
      where: {
        id: levelId,
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
  }
}
