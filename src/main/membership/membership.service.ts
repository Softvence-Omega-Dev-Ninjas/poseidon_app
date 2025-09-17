import { HttpException, Injectable } from '@nestjs/common';
import { cResponseData } from 'src/common/utils/common-responseData';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import { CreateMembershipLevelDto } from './dto/create-membership-level.dto';
import {
  LevelImageUpdateDto,
  UpdateMembershipLevelDto,
} from './dto/update-membership-level.dto';
import { MediafileService } from '../mediafile/mediafile.service';

@Injectable()
export class MembershipService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly mediafileService: MediafileService,
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

    console.log('images uploading - host......');

    const { mediaId } = await this.cloudinaryService.imageUpload(
      createMembershipLevelDto.levelImage,
    );
    const { MembershipSubscriptionPlan, ...data } = createMembershipLevelDto;

    console.log('images upload - successfull......');

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

  async updateMembershipLevel(dto: UpdateMembershipLevelDto) {
    const updateNewData = await this.prisma.membership_levels.update({
      where: { id: dto.id },
      data: {
        levelName: dto.levelName,
        titleName: dto.titleName,
        levelDescription: dto.levelDescription,
        levelImage: dto.levelImage,
        isPublic: dto.isPublic,
        Wellcome_note: dto.Wellcome_note ?? null,

        MembershipSubscriptionPlan: {
          update: dto.MembershipSubscriptionPlan.map((plan) => ({
            where: { id: plan.id },
            data: {
              duration: plan.duration,
              price: plan.price,

              CalligSubscriptionPlan: plan.CalligSubscriptionPlan
                ? { update: { ...plan.CalligSubscriptionPlan } }
                : { delete: true },

              MessagesSubscriptionPlan: plan.MessagesSubscriptionPlan
                ? { update: { ...plan.MessagesSubscriptionPlan } }
                : { delete: true },

              GallerySubscriptionPlan: plan.GallerySubscriptionPlan
                ? { update: { ...plan.GallerySubscriptionPlan } }
                : { delete: true },

              PostsSubscriptionPlan: plan.PostsSubscriptionPlan
                ? { update: { ...plan.PostsSubscriptionPlan } }
                : { delete: true },
            },
          })),
        },
      },
    });

    return cResponseData({
      message: 'Membership level updated successfully',
      data: updateNewData,
      success: true,
    });

    // await this.prisma.$transaction(async (tx) => {
    //   // 1️⃣ Update the parent membership level
    //   const updatedLevel = await tx.membership_levels.update({
    //     where: { id: dto.id },
    //     data: {
    //       levelName: dto.levelName,
    //       titleName: dto.titleName,
    //       levelDescription: dto.levelDescription,
    //       levelImage: dto.levelImage,
    //       isPublic: dto.isPublic,
    //       Wellcome_note: dto.Wellcome_note,
    //     },
    //   });

    //   // 2️⃣ Update each subscription plan with its nested child plans
    //   for (const plan of dto.MembershipSubscriptionPlan) {
    //     await tx.membershipSubscriptionPlan.update({
    //       where: { id: plan.id },
    //       data: {
    //         duration: plan.duration,
    //         price: plan.price,

    //         CalligSubscriptionPlan: plan.CalligSubscriptionPlan
    //           ? {
    //               update: {
    //                 where: { id: plan.CalligSubscriptionPlan.id },
    //                 data: { ...plan.CalligSubscriptionPlan },
    //               },
    //             }
    //           : { delete: {} },

    //         MessagesSubscriptionPlan: plan.MessagesSubscriptionPlan
    //           ? {
    //               update: {
    //                 ...plan.MessagesSubscriptionPlan,
    //               },
    //             }
    //           : undefined,

    //         GallerySubscriptionPlan: plan.GallerySubscriptionPlan
    //           ? {
    //               update: {
    //                 ...plan.GallerySubscriptionPlan,
    //               },
    //             }
    //           : undefined,

    //         PostsSubscriptionPlan: plan.PostsSubscriptionPlan
    //           ? {
    //               update: {
    //                 ...plan.PostsSubscriptionPlan,
    //               },
    //             }
    //           : undefined,
    //       },
    //     });
    //   }

    //   return updatedLevel;
    // });
  }

  // delete membership level
  async deleteMembershipLevel(id: string) {
    const checkLevel = await this.prisma.membership_levels.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        levelImage: true,
      },
    });
    if (!checkLevel || !checkLevel?.id) {
      throw new HttpException(
        cResponseData({
          message: 'Membership level not found',
          data: null,
          success: false,
        }),
        404,
      );
    }

    // delete images with db media and cloudinary
    const deleteImage = await this.mediafileService.deleteMembershipImage(
      checkLevel?.levelImage,
    );

    const deleteMembershipLevel = await this.prisma.membership_levels.delete({
      where: {
        id,
      },
    });
    if (!deleteMembershipLevel || !deleteMembershipLevel?.id)
      throw new HttpException(
        cResponseData({
          message: 'Membership level delete failed',
          data: null,
          success: false,
        }),
        404,
      );
    return cResponseData({
      message: 'Membership level deleted successfully',
      data: { ...deleteMembershipLevel, deleteImage },
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

  async getMembershipLevel(levelId: string) {
    const level = await this.prisma.membership_levels.findFirst({
      where: {
        id: levelId,
      },
      include: {
        MembershipSubscriptionPlan: {
          include: {
            CalligSubscriptionPlan: true,
            MessagesSubscriptionPlan: true,
            GallerySubscriptionPlan: true,
            PostsSubscriptionPlan: true,
          },
        },
      },
    });
    if (level && level.levelImage) {
      const images = await this.prisma.media.findFirst({
        where: {
          id: level.levelImage,
        },
      });
      return cResponseData({
        message: 'Membership level found successfully',
        data: { ...level, levelImage: images },
      });
    }

    return cResponseData({
      message: 'Membership level not found',
      data: level,
    });
  }
}
