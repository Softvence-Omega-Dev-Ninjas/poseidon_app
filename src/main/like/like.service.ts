import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { Like } from '../../../generated/prisma';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async create(createLikeDto: CreateLikeDto, userId: string): Promise<Like> {
    const { postId } = createLikeDto;
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      const post = await this.prisma.post.findUnique({ where: { id: postId } });
      if (post && post.likeCount > 0) {
        await this.prisma.like.delete({
          where: {
            userId_postId: {
              userId,
              postId,
            },
          },
        });
        await this.prisma.post.update({
          where: { id: postId },
          data: { likeCount: { decrement: 1 } },
        });
      }
      return existingLike;
    } else {
      const newLike = await this.prisma.like.create({ data: { userId, postId } });
      await this.prisma.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } },
      });
      return newLike;
    }
  }
}
