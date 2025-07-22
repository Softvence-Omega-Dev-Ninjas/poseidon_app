import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { Like } from '../../../generated/prisma';
import { Prisma } from '../../../generated/prisma';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async create(createLikeDto: CreateLikeDto, userId: string): Promise<Like> {
    const { postId } = createLikeDto;

    try {
      return await this.prisma.$transaction(async (prisma) => {
        const newLike = await prisma.like.create({
          data: { userId, postId },
        });

        await prisma.post.update({
          where: { id: postId },
          data: { likeCount: { increment: 1 } },
        });

        return newLike;
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('User has already liked this post.');
      }
      throw error;
    }
  }

  async delete(postId: string, userId: string): Promise<void> {
    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.like.delete({
          where: {
            userId_postId: {
              userId,
              postId,
            },
          },
        });

        await prisma.post.update({
          where: { id: postId },
          data: { likeCount: { decrement: 1 } },
        });
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Like not found.');
      }
      throw error;
    }
  }
}
