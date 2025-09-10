import { HttpException, Injectable } from '@nestjs/common';
import { cResponseData } from 'src/common/utils/common-responseData';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { BuyMembershipDto } from './dto/buyMembership.dto';
import { StripeService } from 'src/utils/stripe/stripe.service';

@Injectable()
export class MembershipServiceUseToUserOnly {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
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
    const checkout = await this.stripeService.checkOutPaymentSessionsMembership(
      {
        amount: Number(membershipLevel?.MembershipSubscriptionPlan[0].price),
        buyerId: userId,
        sellerId: membershipLevel?.membership.owner.id as string,
        serviceName: membershipLevel?.titleName as string,
        serviceType: 'membership',
        serviceId: membershipLevel?.id as string,
      },
    );

    return cResponseData({
      message: 'Membership bought successfully',
      data: { userId, membershipLevel, checkout },
      success: true,
    });
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
