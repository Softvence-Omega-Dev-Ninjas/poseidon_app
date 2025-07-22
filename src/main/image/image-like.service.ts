import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CreateImageLikeDto } from './dto/create-image-like.dto';
import { ImageLike, Prisma } from '../../../generated/prisma';

@Injectable()
export class ImageLikeService {
  constructor(private prisma: PrismaService) {}

  async create(createImageLikeDto: CreateImageLikeDto, userId: string): Promise<ImageLike> {
    const { imageId } = createImageLikeDto;

    try {
      return await this.prisma.$transaction(async (prisma) => {
        const newImageLike = await prisma.imageLike.create({
          data: { userId, imageId },
        });

        await prisma.image.update({
          where: { id: imageId },
          data: { likeCount: { increment: 1 } },
        });

        return newImageLike;
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('User has already liked this image.');
      }
      throw error;
    }
  }

  async delete(imageId: string, userId: string): Promise<void> {
    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.imageLike.delete({
          where: {
            userId_imageId: {
              userId,
              imageId,
            },
          },
        });

        await prisma.image.update({
          where: { id: imageId },
          data: { likeCount: { decrement: 1 } },
        });
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Image like not found.');
      }
      throw error;
    }
  }
}