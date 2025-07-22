import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CreateImageCommentDto } from './dto/create-image-comment.dto';
import { ImageComment } from '../../../generated/prisma';

@Injectable()
export class ImageCommentService {
  constructor(private prisma: PrismaService) {}

  async create(createImageCommentDto: CreateImageCommentDto, userId: string): Promise<ImageComment> {
    return this.prisma.$transaction(async (prisma) => {
      const newImageComment = await prisma.imageComment.create({
        data: { ...createImageCommentDto, userId },
      });

      await prisma.image.update({
        where: { id: createImageCommentDto.imageId },
        data: { commentCount: { increment: 1 } },
      });

      return newImageComment;
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    const imageComment = await this.prisma.imageComment.findUnique({
      where: { id },
    });

    if (!imageComment) {
      throw new NotFoundException(`Image comment with ID ${id} not found`);
    }

    if (imageComment.userId !== userId) {
      throw new NotFoundException('You are not authorized to delete this comment.');
    }

    await this.prisma.$transaction(async (prisma) => {
      await prisma.imageComment.delete({
        where: { id },
      });

      await prisma.image.update({
        where: { id: imageComment.imageId },
        data: { commentCount: { decrement: 1 } },
      });
    });
  }
}