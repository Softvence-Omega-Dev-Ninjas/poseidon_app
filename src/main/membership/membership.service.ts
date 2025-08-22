import { Injectable } from '@nestjs/common';
import { cResponseData } from 'src/common/utils/common-responseData';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import { CreateMembershipLevelDto } from './dto/create-membership-level.dto';

@Injectable()
export class MembershipService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // Enable membership for a specific supporter user
  async enableMembership(userId: string) {
    const enableMembership = await this.prisma.$transaction(async (tx) => {
      const existingMembership = await tx.membership_owner.findFirst({
        where: {
          ownerId: userId,
        },
      });
      if (existingMembership && existingMembership.id) {
        return {
          message: 'Membership already exists',
          error: 'Membership conflict',
          data: null,
          success: false,
        };
      }
      const newMembership = await tx.membership_owner.create({
        data: {
          ownerId: userId,
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
      });
      return {
        message: 'Membership enabled successfully',
        data: newMembership.id,
        success: true,
      };
    });
    return cResponseData(enableMembership);
  }

  // create a membership levels
  createMembershipLevel(createMembershipLevelDto: CreateMembershipLevelDto) {
    // levelImage upload
    // const { mediaId } = await this.cloudinaryService.imageUpload(
    //   createMembershipLevelDto.levelImage,
    // );
    // const { subscriptionPlans, ...data } = createMembershipLevelDto;
    // const newMembershipLevel = await this.prisma.membership_levels.create({
    //   data: {
    //     ...data,
    //     levelImage: mediaId,
    //     MembershipSubscriptionPlan: {
    //       createMany: {
    //         data: JSON.parse(subscriptionPlans as any),
    //       },
    //     },
    //   },
    // });
    console.log(createMembershipLevelDto);
    return cResponseData({
      message: 'Membership level created successfully',
      data: createMembershipLevelDto,
      success: true,
    });
  }

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
