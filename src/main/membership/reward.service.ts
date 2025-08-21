import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import {
  CreateVideoCallRewardDto,
  CreateMembershipAccessToMessagesDto,
  CreateMembershipAccessToGalleryDto,
  CreateMembershipAccessToPostsDto,
} from './dto/create-all-reward.dto';
import { cResponseData } from 'src/common/utils/common-responseData';

@Injectable()
export class MembershipRewardService {
  constructor(private readonly prisma: PrismaService) {}

  async createVideoCallReward(
    createVideoCallRewardDto: CreateVideoCallRewardDto,
  ) {
    const newData = await this.prisma.membershipAccessToVideoCall.create({
      data: createVideoCallRewardDto,
    });
    return cResponseData({
      message: 'Video access reward created successfully',
      data: newData,
    });
  }

  async createMessagesAccessReward(
    createMessagesAccessDto: CreateMembershipAccessToMessagesDto,
  ) {
    const newData = await this.prisma.membershipAccessToMessages.create({
      data: createMessagesAccessDto,
    });
    return cResponseData({
      message: 'Messages access reward created successfully',
      data: newData,
    });
  }

  async createGalleryAccessReward(
    createGalleryAccessDto: CreateMembershipAccessToGalleryDto,
  ) {
    const newData = await this.prisma.membershipAccessToGallery.create({
      data: createGalleryAccessDto,
    });
    return cResponseData({
      message: 'Gallery access reward created successfully',
      data: newData,
    });
  }

  async createPostsAccessReward(
    createPostsAccessDto: CreateMembershipAccessToPostsDto,
  ) {
    const newData = await this.prisma.membershipAccessToPosts.create({
      data: createPostsAccessDto,
    });
    return cResponseData({
      message: 'Posts access reward created successfully',
      data: newData,
    });
  }

  async getAllReward(membershipId: string) {
    return await this.prisma.$transaction(async (tx) => {
      const videoCallReward = await tx.membershipAccessToVideoCall.findMany({
        where: {
          membership_ownerId: membershipId,
        },
      });

      const messagesAccessReward = await tx.membershipAccessToMessages.findMany(
        {
          where: {
            membership_ownerId: membershipId,
          },
        },
      );

      const galleryReward = await tx.membershipAccessToGallery.findMany({
        where: {
          membership_ownerId: membershipId,
        },
      });

      const postsReward = await tx.membershipAccessToPosts.findMany({
        where: {
          membership_ownerId: membershipId,
        },
      });

      return cResponseData({
        message: 'All rewards fetched successfully',
        data: {
          videoCallReward,
          messagesAccessReward,
          galleryReward,
          postsReward,
        },
      });
    });
  }
}
