import { Injectable } from '@nestjs/common';
import { cResponseData } from 'src/common/utils/common-responseData';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class MembershipServiceUseToUserOnly {
  constructor(private readonly prisma: PrismaService) {}

  // get all membership levels
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
}
