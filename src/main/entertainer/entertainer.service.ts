import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { profile } from 'console';
import { Roles } from 'generated/prisma';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class EntertainerService {
  constructor(private readonly prisma: PrismaService) {}

  //   Get all entertainer or supporters...
  async getAllEntertainer(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
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
  // get supporter recent post...
  async getRecentSupporterPosts(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Sorry Unauthorized Access');
    }
    //  Get 5 supporters (can order by createdAt or any other field)
    const supporters = await this.prisma.user.findMany({
      where: { role: Roles.supporter },
      orderBy: { createdAt: 'desc' }, // latest supporters
      take: 5,
      select: { id: true },
    });

    const supporterIds = supporters.map((s) => s.id);

    //  Get the most recent post of each supporter
    const recentPosts = await Promise.all(
      supporterIds.map(async (supporterId) => {
        const post = await this.prisma.post.findFirst({
          where: { userId: supporterId },
          orderBy: { createdAt: 'desc' },
          select: {
            images: true,
            user: {
              select: {
                id: true,
                profile: {
                  select: { name: true, image: true, description: true },
                },
              },
            },
          },
        });
        return post;
      }),
    );

    // Remove supporters without posts
    return recentPosts.filter((p) => p !== null);
  }

  // follow supporter...
  async followSuporter(userId: string, supporterId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Sorry Unauthorized Access');
    }
    if (userId === supporterId) {
      throw new ConflictException('You cannot follow yourself');
    }
    const existFollow = await this.prisma.follower.findFirst({
      where: { followerId: userId },
    });
    if (existFollow) {
      throw new BadRequestException('User Already follow this supporter.');
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
  // get my following list...
  async getFollowingList(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const following = await this.prisma.follower.findMany({
      where: { followerId: userId },
      include: {
        following: {
          include: {
            profile: true,
            posts: true,
          },
        },
      },
    });

    return following.map((f) => {
      // aggregate totals from posts
      const totalLikeCount = f.following.posts.reduce(
        (sum, p) => sum + p.likeCount,
        0,
      );
      const totalCommentCount = f.following.posts.reduce(
        (sum, p) => sum + p.commentCount,
        0,
      );
      const totalViewCount = f.following.posts.reduce(
        (sum, p) => sum + p.view,
        0,
      );

      return {
        id: f.following.id,
        role: f.following.role,
        createdAt: f.following.createdAt,
        profile: {
          name: f.following.profile?.name,
          image: f.following.profile?.image,
          description: f.following.profile?.description,
        },
        totals: {
          totalLikeCount,
          totalCommentCount,
          totalViewCount,
        },
      };
    });
  }
}
