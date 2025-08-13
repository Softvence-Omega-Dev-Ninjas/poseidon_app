import { Injectable } from '@nestjs/common';
import { cResponseData } from 'src/common/utils/common-responseData';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
// import { CreateMembershipDto } from './dto/create-membership.dto';
// import { UpdateMembershipDto } from './dto/update-membership.dto';

@Injectable()
export class MembershipService {
  constructor(private readonly prisma: PrismaService) {}

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
            create: {},
          },
          MembershipAccessToMessages: {
            create: {},
          },
          MembershipAccessToGallery: {
            create: {},
          },
          MembershipAccessToPosts: {
            create: {},
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

  findAll() {
    return `This action returns all membership`;
  }

  findOne(id: number) {
    return `This action returns a #${id} membership`;
  }

  // update(id: number, updateMembershipDto: UpdateMembershipDto) {
  //   return `This action updates a #${id} membership`;
  // }

  remove(id: number) {
    return `This action removes a #${id} membership`;
  }
}
