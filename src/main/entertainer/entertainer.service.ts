import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Roles } from 'generated/prisma';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class EntertainerService {
  constructor(private readonly prisma: PrismaService) {}

  //   Get all entertainer or supporters...
  async getAllEntertainer(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userId) {
      throw new BadRequestException('Sorry Unauthorized Access');
    }
    return await this.prisma.user.findMany({
      where: { role: Roles.supporter },
      select: {
        id: true,
        profile: {
          select: {
            name: true,
            image: true,
            description: true,
          },
        },
      },
    });
  }
  // follow supporter...
  async followSuporter(userId: string, supporterId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userId) {
      throw new BadRequestException('Sorry Unauthorized Access');
    }
    if (userId === supporterId) {
      throw new ConflictException('You cannot follow yourself');
    }
    return await this.prisma.follower.create({
      data: {
        follower: {
          connect: { id: userId },
        },
        following: {
          connect: { id: supporterId },
        },
      },
    });
  }
  // unfollow suporter..
  async unfollowSuporter(userId: string, supporterId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userId) {
      throw new BadRequestException('Sorry Unauthorized Access');
    }
    return this.prisma.follower.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: supporterId,
        },
      },
    });
  }
}
