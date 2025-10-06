import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
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

    if (
      newMembershipLevel.MembershipSubscriptionPlan[0].CalligSubscriptionPlan ||
      newMembershipLevel.MembershipSubscriptionPlan[1].CalligSubscriptionPlan
    ) {
      // TODO: zoom video call link create this area
      const zoomUrls = 'zoom url ========<<<<<<<<<<<<';
      await this.prisma.membership_levels.update({
        where: { id: newMembershipLevel.id },
        data: {
          zoomUrl: zoomUrls,
        },
      });
    }

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

    const existingLavel = await this.prisma.membership_levels.findUnique({
      where: { id: dto.id },
      include: {
        MembershipSubscriptionPlan: true,
      },
    });

    // Check if the lavel before try to update entity
    if (!existingLavel) {
      throw new NotFoundException(
        `Membership lavel with ID ${dto.id} not found`,
      );
    }

    // TODO(coderboysobuj) handle image upload if file is provided
    // let lavelImageUrl : string | undefined = undefined;
    // if(dto.levelImage) {
    //     try {
    //         const uploadResult = await this.cloudinaryService.imageUpload(dto.levelImage)
    //         lavelImageUrl = uploadResult.mediaId;
    //     } catch (error: any) {
    //          throw new BadRequestException('Failed to upload image');
    //          console.error("Error upload image for `membership_levels` update", error);
    //     }
    // }

    return cResponseData({
      message: 'Membership level updated successfully',
      data: updateNewData,
      success: true,
    });
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

  async getTop3Card(id: string) {
    const time = new Date();
    const y = time.getFullYear();
    const m = time.getMonth();

    return await this.prisma.$transaction(async (tx) => {
      const totalMember = await tx.paymentDetails.groupBy({
        by: ['buyerId'],
        where: {
          sellerId: id,
          buyerId: { not: null },
          serviceType: 'membership',
        },
      });
      const perMonth = await tx.paymentDetails.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          sellerId: id,
          buyerId: { not: null },
          serviceType: 'membership',
          createAt: {
            gte: new Date(y, m, 1),
            lte: new Date(y, m + 1, 0),
          },
        },
      });
      const allTime = await tx.paymentDetails.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          sellerId: id,
          buyerId: { not: null },
          serviceType: 'membership',
        },
      });
      return {
        Members: totalMember.length,
        perMonth: perMonth?._sum.amount ? perMonth?._sum.amount : 0.0,
        allTime: allTime?._sum.amount ? allTime?._sum.amount : 0.0,
      };
    });
  }

  async yearlyEarningChart(id: string) {
    const MONTH_NAMES = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const year = new Date().getFullYear();
    const payments = await this.prisma.paymentDetails.findMany({
      where: {
        sellerId: id,
        paymemtStatus: 'paid',
        createAt: {
          gte: new Date(year, 0, 1), // Jan 1
          lt: new Date(year + 1, 0, 1), // next year Jan 1
        },
      },
      select: {
        amount: true,
        createAt: true,
      },
    });
    const monthly: Record<string, number> = {};
    for (const p of payments) {
      const month = MONTH_NAMES[Number(p.createAt.getMonth())]; // 0-11
      if (!monthly[month]) {
        monthly[month] = 0;
      }
      monthly[month] += p.amount;
    }
    return (
      MONTH_NAMES.map((month) => {
        if (monthly[month]) return { name: month, earnings: monthly[month] };
        return { name: month, earnings: 0.0 };
      }) || []
    );
  }
}
