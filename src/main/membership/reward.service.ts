import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import {
  CreateVideoCallRewardDto,
  CreateMembershipAccessToMessagesDto,
  CreateMembershipAccessToGalleryDto,
  CreateMembershipAccessToPostsDto,
} from './dto/create-all-reward.dto';
import { cResponseData } from 'src/common/utils/common-responseData';
import {
  UpdateGalleryRewardDto,
  UpdateMessagesRewardDto,
  UpdatePostsRewardDto,
  UpdateVideoCallRewardDto,
} from './dto/update-reward.dto';

@Injectable()
export class MembershipRewardService {
  constructor(private readonly prisma: PrismaService) {}

  // vedio call reward
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
  async updateVideoCallReward(
    id: string,
    updateVideoCallRewardDto: UpdateVideoCallRewardDto,
  ) {
    const newData = await this.prisma.membershipAccessToVideoCall.update({
      where: {
        id,
      },
      data: updateVideoCallRewardDto,
    });
    return cResponseData({
      message: 'Video access reward updated successfully',
      data: newData,
    });
  }

  // Messages reward
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
  async updateMessagesReward(
    id: string,
    updateMessagesRewardDto: UpdateMessagesRewardDto,
  ) {
    const newData = await this.prisma.membershipAccessToMessages.update({
      where: {
        id,
      },
      data: updateMessagesRewardDto,
    });
    return cResponseData({
      message: 'Messages access reward updated successfully',
      data: newData,
    });
  }

  // Gallery reward
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
  async updateGalleryReward(
    id: string,
    updateGalleryRewardDto: UpdateGalleryRewardDto,
  ) {
    const newData = await this.prisma.membershipAccessToGallery.update({
      where: {
        id,
      },
      data: updateGalleryRewardDto,
    });
    return cResponseData({
      message: 'Gallery access reward updated successfully',
      data: newData,
    });
  }

  // Posts api
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
  async updatePostsReward(
    id: string,
    updatePostsRewardDto: UpdatePostsRewardDto,
  ) {
    const newData = await this.prisma.membershipAccessToPosts.update({
      where: {
        id,
      },
      data: updatePostsRewardDto,
    });
    return cResponseData({
      message: 'Posts access reward updated successfully',
      data: newData,
    });
  }

  // gest all reward by membership id
  async getAllReward(membershipId: string) {
    return await this.prisma.$transaction(async (tx) => {
      const CalligSubscriptionPlan =
        await tx.membershipAccessToVideoCall.findMany({
          where: {
            membership_ownerId: membershipId,
          },
        });

      const MessagesSubscriptionPlan =
        await tx.membershipAccessToMessages.findMany({
          where: {
            membership_ownerId: membershipId,
          },
        });

      const GallerySubscriptionPlan =
        await tx.membershipAccessToGallery.findMany({
          where: {
            membership_ownerId: membershipId,
          },
        });

      const PostsSubscriptionPlan = await tx.membershipAccessToPosts.findMany({
        where: {
          membership_ownerId: membershipId,
        },
      });

      return cResponseData({
        message: 'All rewards fetched successfully',
        data: {
          CalligSubscriptionPlan,
          MessagesSubscriptionPlan,
          GallerySubscriptionPlan,
          PostsSubscriptionPlan,
        },
      });
    });
  }

  // delete apis this area
  async deleteVideoCallReward(id: string) {
    const newData = await this.prisma.membershipAccessToVideoCall.delete({
      where: {
        id,
      },
    });
    return cResponseData({
      message: 'Video access reward deleted successfully',
      data: newData,
    });
  }

  async deleteMessagesAccessReward(id: string) {
    const newData = await this.prisma.membershipAccessToMessages.delete({
      where: {
        id,
      },
    });
    return cResponseData({
      message: 'Messages access reward deleted successfully',
      data: newData,
    });
  }

  async deleteGalleryAccessReward(id: string) {
    const newData = await this.prisma.membershipAccessToGallery.delete({
      where: {
        id,
      },
    });
    return cResponseData({
      message: 'Gallery access reward deleted successfully',
      data: newData,
    });
  }

  async deletePostsAccessReward(id: string) {
    const newData = await this.prisma.membershipAccessToPosts.delete({
      where: {
        id,
      },
    });
    return cResponseData({
      message: 'Posts access reward deleted successfully',
      data: newData,
    });
  }
}
