import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FindAllImagesDto, ImageSortBy } from './dto/find-all-images.dto';
import { Image, Prisma } from '../../../generated/prisma';

@Injectable()
export class ImageService {
  constructor(private prisma: PrismaService, private cloudinaryService: CloudinaryService) {}

  async create(createImageDto: CreateImageDto, userId: string, file?: Express.Multer.File): Promise<Image> {
    let mediaId: string | undefined;

    if (file) {
      const uploadRes = await this.cloudinaryService.imageUpload(file);
      mediaId = uploadRes.mediaId;
    }

    return this.prisma.image.create({
      data: {
        ...createImageDto,
        mediaId: mediaId || '', // Directly assign mediaId
        userId,
      },
    });
  }

  async findAll(
    query: FindAllImagesDto,
    userId?: string,
  ): Promise<
    { data: (Image & { isLiked?: boolean })[]; total: number; currentPage: number; limit: number; totalPages: number }
  > {
    const { page = '1', limit = '10', sortBy = ImageSortBy.NEWEST, visibility } = query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    let orderBy: Prisma.ImageOrderByWithRelationInput;
    switch (sortBy) {
      case ImageSortBy.LIKED:
        orderBy = { likeCount: 'desc' };
        break;
      case ImageSortBy.VIEWED:
        orderBy = { view: 'desc' };
        break;
      case ImageSortBy.NEWEST:
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const where: Prisma.ImageWhereInput = {};
    if (visibility) {
      where.visibility = visibility;
    }

    const [images, total] = await this.prisma.$transaction([
      this.prisma.image.findMany({
        where,
        skip: offset,
        take: limitNumber,
        orderBy,
        include: { likes: { where: { userId } } },
      }),
      this.prisma.image.count({ where }),
    ]);

    const imagesWithIsLiked = images.map((image) => {
      const { likes, ...rest } = image;
      return { ...rest, isLiked: likes.length > 0 };
    });

    const totalPages = Math.ceil(total / limitNumber);

    return {
      data: imagesWithIsLiked,
      total,
      currentPage: pageNumber,
      limit: limitNumber,
      totalPages,
    };
  }

  async findOne(id: string, userId?: string): Promise<Image & { isLiked?: boolean }> {
    const image = await this.prisma.image.findUnique({
      where: { id },
      include: { likes: { where: { userId } } },
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    // Increment view count
    await this.prisma.image.update({
      where: { id },
      data: { view: { increment: 1 } },
    });

    const { likes, ...rest } = image;
    return { ...rest, isLiked: likes.length > 0 };
  }

  async update(id: string, updateImageDto: UpdateImageDto, userId: string, file?: Express.Multer.File): Promise<Image> {
    const existingImage = await this.prisma.image.findUnique({
      where: { id },
      include: { media: true },
    });

    if (!existingImage) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    if (existingImage.userId !== userId) {
      throw new ForbiddenException('You are not authorized to update this image.');
    }

    let newMediaId: string | undefined;

    if (file) {
      // Delete old image from Cloudinary if it exists
      if (existingImage.media && existingImage.media.publicId) {
        await this.cloudinaryService.deleteFile(existingImage.media.publicId);
        await this.prisma.media.delete({ where: { id: existingImage.media.id } });
      }
      const uploadRes = await this.cloudinaryService.imageUpload(file);
      newMediaId = uploadRes.mediaId;
    }

    return this.prisma.image.update({
      where: { id },
      data: {
        ...updateImageDto,
        ...(newMediaId && { mediaId: newMediaId }),
      },
    });
  }

  async remove(id: string, userId: string): Promise<Image> {
    const existingImage = await this.prisma.image.findUnique({
      where: { id },
      include: { media: true },
    });

    if (!existingImage) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    if (existingImage.userId !== userId) {
      throw new ForbiddenException('You are not authorized to delete this image.');
    }

    // Delete image from Cloudinary
    if (existingImage.media && existingImage.media.publicId) {
      await this.cloudinaryService.deleteFile(existingImage.media.publicId);
      await this.prisma.media.delete({ where: { id: existingImage.media.id } });
    }

    return this.prisma.image.delete({
      where: { id },
    });
  }

  async createLike(imageId: string, userId: string): Promise<any> {
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

  async deleteLike(imageId: string, userId: string): Promise<void> {
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

  async createComment(imageId: string, createImageCommentDto: any, userId: string): Promise<any> {
    return this.prisma.$transaction(async (prisma) => {
      const newImageComment = await prisma.imageComment.create({
        data: { ...createImageCommentDto, imageId, userId },
      });

      await prisma.image.update({
        where: { id: imageId },
        data: { commentCount: { increment: 1 } },
      });

      return newImageComment;
    });
  }

  async deleteComment(imageId: string, commentId: string, userId: string): Promise<void> {
    const imageComment = await this.prisma.imageComment.findUnique({
      where: { id: commentId },
    });

    if (!imageComment) {
      throw new NotFoundException(`Image comment with ID ${commentId} not found`);
    }

    if (imageComment.userId !== userId) {
      throw new ForbiddenException('You are not authorized to delete this comment.');
    }

    await this.prisma.$transaction(async (prisma) => {
      await prisma.imageComment.delete({
        where: { id: commentId },
      });

      await prisma.image.update({
        where: { id: imageComment.imageId },
        data: { commentCount: { decrement: 1 } },
      });
    });
  }
}
