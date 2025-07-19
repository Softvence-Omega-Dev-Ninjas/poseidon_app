import { Injectable, ConflictException } from '@nestjs/common';
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
      throw new ConflictException('User has already liked this post');
    }

    return this.prisma.like.create({ data: { userId, postId } });
  }

  async getLikeCountForPost(postId: string): Promise<number> {
    return this.prisma.like.count({
      where: { postId },
    });
  }
}
