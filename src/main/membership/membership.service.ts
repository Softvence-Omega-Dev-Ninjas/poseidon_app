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

  // Enable membership for a specific supporter user
  enableMembership(userId: string, enable: boolean) {
    console.log(userId, enable);
    const bss = false;
    if (!bss && enable) {
      return 'yess';
    }
    return 'nooo';
    // const enableMembership = await this.prisma.$transaction(async (tx) => {
    //   const existingMembership = await tx.membership_owner.findFirst({
    //     where: {
    //       ownerId: userId,
    //     },
    //   });
    //   if (existingMembership && existingMembership.id) {
    //     return {
    //       message: 'Membership already exists',
    //       error: 'Membership conflict',
    //       data: null,
    //       success: false,
    //     };
    //   }
    //   const newMembership = await tx.membership_owner.create({
    //     data: {
    //       ownerId: userId,
    //       MembershipAccessToVideoCall: {
    //         create: [{ duration: 'ONE_MONTH' }, { duration: 'ONE_YEAR' }],
    //       },
    //       MembershipAccessToMessages: {
    //         create: [{ duration: 'ONE_MONTH' }, { duration: 'ONE_YEAR' }],
    //       },
    //       MembershipAccessToGallery: {
    //         create: [{ duration: 'ONE_MONTH' }, { duration: 'ONE_YEAR' }],
    //       },
    //       MembershipAccessToPosts: {
    //         create: [{ duration: 'ONE_MONTH' }, { duration: 'ONE_YEAR' }],
    //       },
    //     },
    //   });
    //   return {
    //     message: 'Membership enabled successfully',
    //     data: newMembership.id,
    //     success: true,
    //   };
    // });
    // return cResponseData(enableMembership);
  }

  // create a membership levels
  async createMembershipLevel(
    createMembershipLevelDto: CreateMembershipLevelDto,
  ) {
    // levelImage upload
    const { mediaId } = await this.cloudinaryService.imageUpload(
      createMembershipLevelDto.levelImage,
    );
    const { MembershipSubscriptionPlan, ...data } = createMembershipLevelDto;
    const newMembershipLevel = await this.prisma.membership_levels.create({
      data: {
        ...data,
        Wellcome_note: createMembershipLevelDto.wellcome_note || null,
        levelImage: mediaId,
        MembershipSubscriptionPlan: {
          create: MembershipSubscriptionPlan.map((plan) => ({
            ...plan,
            CalligSubscriptionPlan: plan.CalligSubscriptionPlan
              ? {
                  create: plan.CalligSubscriptionPlan,
                }
              : undefined,
            MessagesSubscriptionPlan: plan.MessagesSubscriptionPlan
              ? {
                  create: plan.MessagesSubscriptionPlan,
                }
              : undefined,
            GallerySubscriptionPlan: plan.GallerySubscriptionPlan
              ? {
                  create: plan.GallerySubscriptionPlan,
                }
              : undefined,
            PostsSubscriptionPlan: plan.PostsSubscriptionPlan
              ? {
                  create: plan.PostsSubscriptionPlan,
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
