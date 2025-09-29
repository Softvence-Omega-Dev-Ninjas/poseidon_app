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
  constructor(private readonly prisma: PrismaService) { }

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
  // get supporter recent post...
  async getSupporterRecentPosts(userId: string, supporterId: string) {
  const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Sorry Unauthorized Access');
    }
    console.log(supporterId)
    const supporterPost = await this.prisma.post.findMany({
    where: { userId: supporterId}, 
    orderBy: { createdAt: 'desc' },
    take: 1, 
     select:{
      images:true,
      user:{
        select:{
          profile:{
            select:{name:true, image:true, description:true}
          }
        }
      }
     }
  });
  console.log(supporterId,"data", supporterPost)
   return supporterPost
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
          }
        }
      },
    });

    return following.map(f => {
      // aggregate totals from posts
      const totalLikeCount = f.following.posts.reduce((sum, p) => sum + p.likeCount, 0);
      const totalCommentCount = f.following.posts.reduce((sum, p) => sum + p.commentCount, 0);
      const totalViewCount = f.following.posts.reduce((sum, p) => sum + p.view, 0);

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
