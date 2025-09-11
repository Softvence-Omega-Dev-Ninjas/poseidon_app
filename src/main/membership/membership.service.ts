import { HttpException, Injectable } from '@nestjs/common';
import { cResponseData } from 'src/common/utils/common-responseData';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import { CreateMembershipLevelDto } from './dto/create-membership-level.dto';
import { LevelImageUpdateDto } from './dto/update-membership-level.dto';

@Injectable()
export class MembershipService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private async checkEnableMembership(id: string) {
    return await this.prisma.membership_owner.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        enableMembership: true,
      },
    });
  }

  // Enable membership for a specific supporter user
  async enableMembership(mid: string) {
    const existingMembership = await this.checkEnableMembership(mid);
    if (existingMembership?.enableMembership) {
      return {
        message: 'Your Membership Enable already',
        error: 'Membership conflict',
        data: null,
        success: false,
      };
    }
    const newMembership = await this.prisma.membership_owner.update({
      where: {
        id: existingMembership?.id,
      },
      data: {
        enableMembership: true,
        MembershipAccessToVideoCall: {
          create: [{ duration: 'ONE_MONTH' }, { duration: 'ONE_YEAR' }],
        },
        MembershipAccessToMessages: {
          create: [{ duration: 'ONE_MONTH' }, { duration: 'ONE_YEAR' }],
        },
        MembershipAccessToGallery: {
          create: [{ duration: 'ONE_MONTH' }, { duration: 'ONE_YEAR' }],
        },
        MembershipAccessToPosts: {
          create: [{ duration: 'ONE_MONTH' }, { duration: 'ONE_YEAR' }],
        },
      },
      select: { id: true },
    });

    return cResponseData({
      message: 'Membership enabled successfully',
      data: newMembership.id,
      success: true,
    });
  }

  // create a membership levels
  async createMembershipLevel(
    membershipId: string,
    createMembershipLevelDto: CreateMembershipLevelDto,
  ) {
    // levelImage upload
    const mEnable = await this.checkEnableMembership(membershipId);
    if (!mEnable?.enableMembership)
      throw new HttpException(
        cResponseData({
          message: 'Membership not enabled',
          error: 'create Membership Level conflict',
          data: null,
          success: false,
        }),
        404,
      );
    const { mediaId } = await this.cloudinaryService.imageUpload(
      createMembershipLevelDto.levelImage,
    );
    const { MembershipSubscriptionPlan, ...data } = createMembershipLevelDto;
    const newMembershipLevel = await this.prisma.membership_levels.create({
      data: {
        membershipId,
        ...data,
        levelImage: mediaId,
        MembershipSubscriptionPlan: {
          create: MembershipSubscriptionPlan.map((plan) => ({
            ...plan,
            CalligSubscriptionPlan: plan.CalligSubscriptionPlan
              ? {
                  create: {
                    ...plan.CalligSubscriptionPlan,
                    duration: plan.duration,
                  },
                }
              : undefined,
            MessagesSubscriptionPlan: plan.MessagesSubscriptionPlan
              ? {
                  create: {
                    ...plan.MessagesSubscriptionPlan,
                    duration: plan.duration,
                  },
                }
              : undefined,
            GallerySubscriptionPlan: plan.GallerySubscriptionPlan
              ? {
                  create: {
                    ...plan.GallerySubscriptionPlan,
                    duration: plan.duration,
                  },
                }
              : undefined,
            PostsSubscriptionPlan: plan.PostsSubscriptionPlan
              ? {
                  create: {
                    ...plan.PostsSubscriptionPlan,
                    duration: plan.duration,
                  },
                }
              : undefined,
          })),
        },
      },
    });
    return cResponseData({
      message: 'Membership level created successfully',
      data: newMembershipLevel,
      success: true,
    });
  }

  async levelImageUpdate(id: string, levelImage: LevelImageUpdateDto) {
    const updateLevelImage = await this.prisma.membership_levels.update({
      where: {
        id,
      },
      data: levelImage,
    });
    if (!updateLevelImage || !updateLevelImage?.id)
      throw new HttpException(
        cResponseData({
          message: 'Membership level image update failed',
          data: null,
          success: false,
        }),
        404,
      );
    return cResponseData({
      message: 'Membership level image updated successfully',
      data: updateLevelImage,
    });
  }
}
