import { Injectable } from '@nestjs/common';
import { cResponseData } from 'src/common/utils/common-responseData';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CreateMembershipLevelDto } from './dto/create-membership-level.dto';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
// import { CreateMembershipDto } from './dto/create-membership.dto';
// import { UpdateMembershipDto } from './dto/update-membership.dto';

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

  async createMembershipLevel(
    createMembershipLevelDto: CreateMembershipLevelDto,
  ) {
    // levelImage upload
    const { mediaId } = await this.cloudinaryService.imageUpload(
      createMembershipLevelDto.levelImage,
    );

    // return cResponseData({
    //   message: 'Membership level created successfully',
    //   data: { ...createMembershipLevelDto, levelImage: 'levelImage' },
    //   success: true,
    // });

    const { subscriptionPlans, ...data } = createMembershipLevelDto;

    // console.log({...createMembershipLevelDto, subscriptionPlans});

    console.log(data);
    console.log(JSON.parse(subscriptionPlans as any));

    // createMembershipLevelDto.subscriptionPlans.map((plan) => {
    //   console.log(plan);
    // });
    const newMembershipLevel = await this.prisma.membership_levels.create({
      data: {
        ...data,
        levelImage: mediaId,
        MembershipSubscriptionPlan: {
          createMany: {
            data: JSON.parse(subscriptionPlans as any),
          },
        },
      },
    });
    return cResponseData({
      message: 'Membership level created successfully',
      data: newMembershipLevel,
      success: true,
    });
  }
}
