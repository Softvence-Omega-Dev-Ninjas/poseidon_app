import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FindAllImagesDto, ImageSortBy } from './dto/find-all-images.dto';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import { Image, Prisma, Visibility } from '../../../generated/prisma';
import { CreateImageCommentDto } from './dto/create-image-comment.dto';
import { FindAllImageCommentsDto } from './dto/find-all-image-comments.dto';
import { sendResponse } from 'src/common/utils/send-response.util';
import { HttpStatus } from 'src/common/utils/http-status.enum';

@Injectable()
export class ImageService {
  constructor(private prisma: PrismaService, private cloudinaryService: CloudinaryService) {}

  async create(createImageDto: CreateImageDto, userId: string, file: Express.Multer.File): Promise<any> {
    try {
      let mediaId: string;

      if (file) {
        const uploadRes = await this.cloudinaryService.imageUpload(file);
        mediaId = uploadRes.mediaId;
      } else {
        return sendResponse(
          'Image file is required.',
          null,
          HttpStatus.BAD_REQUEST,
        );
      }

      const newImage = await this.prisma.image.create({
        data: {
          ...createImageDto,
          userId,
          mediaId,
        },
      });
      return sendResponse(
        'Image created successfully.',
        newImage,
        HttpStatus.CREATED,
      );
    } catch (error) {
      return sendResponse(
        'Failed to create image.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async findAll(
    query: FindAllImagesDto,
    userId?: string,
  ): Promise<any> {
    try {
      const { page = 1, limit = 10, sortBy = ImageSortBy.NEWEST, visibility } = query;
      const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
      const limitNumber = typeof limit === 'string' ? parseInt(limit, 10) : limit;
      const offset = (pageNumber - 1) * limitNumber;

      let orderBy: Prisma.ImageOrderByWithRelationInput;
      switch (sortBy) {
        case ImageSortBy.VIEWED:
          orderBy = { view: 'desc' };
          break;
        case ImageSortBy.LIKED:
          orderBy = { likes: { _count: 'desc' } };
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
          take: parseInt(limit as any),
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

      return sendResponse(
        'Images retrieved successfully.',
        {
          data: imagesWithIsLiked,
          total,
          currentPage: pageNumber,
          limit: limitNumber,
          totalPages,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      return sendResponse(
        'Failed to retrieve images.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async findOne(id: string, userId?: string): Promise<any> {
    try {
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
      return sendResponse(
        'Image retrieved successfully.',
        { ...rest, isLiked: likes.length > 0 },
        HttpStatus.OK,
      );
    } catch (error) {
      return sendResponse(
        'Failed to retrieve image.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

async update(id: string, updateImageDto: UpdateImageDto, newImage: Express.Multer.File, userId: string): Promise<any> {
  try {
    const image = await this.prisma.image.findUnique({ where: { id } });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    if (image.userId !== userId) {
      throw new ForbiddenException('You are not authorized to update this image.');
    }

    let updatedMediaId = image.mediaId;

    // Handle new image to upload
    if (newImage) {
      const media = await this.prisma.media.findUnique({ where: { id: image.mediaId } });
      if (media) {
        await this.cloudinaryService.deleteFile(media.publicId);
        await this.prisma.media.delete({ where: { id: media.id } });
      }
      const uploadRes = await this.cloudinaryService.imageUpload(newImage);
      updatedMediaId = uploadRes.mediaId;
    }

    const updatedImage = await this.prisma.image.update({
      where: { id },
      data: {
        ...updateImageDto,
        mediaId: updatedMediaId,
      },
    });

    return sendResponse(
      'Image updated successfully.',
      updatedImage,
      HttpStatus.OK,
    );
  } catch (error) {
    return sendResponse(
      'Failed to update image.',
      null,
      HttpStatus.INTERNAL_SERVER_ERROR,
      null,
      error.message,
    );
  }
}

  async remove(id: string, userId: string): Promise<any> {
    try {
      const image = await this.prisma.image.findUnique({
        where: { id },
      });
      if (!image) {
        throw new NotFoundException(`Image with ID ${id} not found`);
      }
      if (image.userId !== userId) {
        throw new ForbiddenException('You are not authorized to delete this image.');
      }

      // Delete associated media from Cloudinary and database
      const media = await this.prisma.media.findUnique({ where: { id: image.mediaId } });
      if (media) {
        await this.cloudinaryService.deleteFile(media.publicId);
        await this.prisma.media.delete({ where: { id: media.id } });
      }

      const deletedImage = await this.prisma.image.delete({
        where: { id },
      });

      return sendResponse(
        'Image deleted successfully.',
        deletedImage,
        HttpStatus.OK,
      );
    } catch (error) {
      return sendResponse(
        'Failed to delete image.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async createLike(imageId: string, userId: string): Promise<any> {
    try {
      const newImageLike = await this.prisma.$transaction(async (prisma) => {
        const like = await prisma.imageLike.create({
          data: { userId, imageId },
        });

        await prisma.image.update({
          where: { id: imageId },
          data: { likeCount: { increment: 1 } },
        });
        return like;
      });
      return sendResponse(
        'Image liked successfully.',
        newImageLike,
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('User has already liked this image.');
      }
      return sendResponse(
        'Failed to like image.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async deleteLike(imageId: string, userId: string): Promise<any> {
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
      return sendResponse(
        'Image like deleted successfully.',
        null,
        HttpStatus.NO_CONTENT,
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Image like not found.');
      }
      return sendResponse(
        'Failed to delete image like.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async createComment(imageId: string, createImageCommentDto: CreateImageCommentDto, userId: string): Promise<any> {
    try {
      const newImageComment = await this.prisma.$transaction(async (prisma) => {
        const comment = await prisma.imageComment.create({
          data: { content: createImageCommentDto.content, imageId, userId },
        });

        await prisma.image.update({
          where: { id: imageId },
          data: { commentCount: { increment: 1 } },
        });
        return comment;
      });
      return sendResponse(
        'Image comment created successfully.',
        newImageComment,
        HttpStatus.CREATED,
      );
    } catch (error) {
      return sendResponse(
        'Failed to create image comment.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async deleteComment(imageId: string, commentId: string, userId: string): Promise<any> {
    try {
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
      return sendResponse(
        'Image comment deleted successfully.',
        null,
        HttpStatus.NO_CONTENT,
      );
    } catch (error) {
      return sendResponse(
        'Failed to delete image comment.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async findAllComments(
    imageId: string,
    query: FindAllImageCommentsDto,
  ): Promise<any> {
    try {
      const { page = 1, limit = 10 } = query;
      const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
      const limitNumber = typeof limit === 'string' ? parseInt(limit, 10) : limit;
      const offset = (pageNumber - 1) * limitNumber;

      const [comments, total] = await this.prisma.$transaction([
        this.prisma.imageComment.findMany({
          where: { imageId },
          skip: offset,
          take: limitNumber,
          include: { user: true },
        }),
        this.prisma.imageComment.count({ where: { imageId } }),
      ]);

      const totalPages = Math.ceil(total / limitNumber);

      return sendResponse(
        'Image comments retrieved successfully.',
        {
          data: comments,
          total,
          currentPage: pageNumber,
          limit: limitNumber,
          totalPages,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      return sendResponse(
        'Failed to retrieve image comments.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async findCommentById(commentId: string): Promise<any> {
    try {
      const comment = await this.prisma.imageComment.findUnique({
        where: { id: commentId },
        include: { user: true },
      });

      if (!comment) {
        throw new NotFoundException(`Image comment with ID ${commentId} not found`);
      }

      return sendResponse(
        'Image comment retrieved successfully.',
        comment,
        HttpStatus.OK,
      );
    } catch (error) {
      return sendResponse(
        'Failed to retrieve image comment.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async incrementViewCount(id: string): Promise<any> {
    try {
      const image = await this.prisma.image.update({
        where: { id },
        data: { view: { increment: 1 } },
      });
      return sendResponse(
        'Image view count incremented successfully.',
        image,
        HttpStatus.OK,
      );
    } catch (error) {
      return sendResponse(
        'Failed to increment image view count.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async getImagesByVisibility(visibility: Visibility, userId?: string): Promise<any> {
    try {
      const images = await this.prisma.image.findMany({
        where: { visibility },
        include: { likes: { where: { userId } } },
      });

      const imagesWithIsLiked = images.map((image) => {
        const { likes, ...rest } = image;
        return { ...rest, isLiked: likes.length > 0 };
      });

      return sendResponse(
        `Images with visibility ${visibility} retrieved successfully.`,
        imagesWithIsLiked,
        HttpStatus.OK,
      );
    } catch (error) {
      return sendResponse(
        `Failed to retrieve images with visibility ${visibility}.`,
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
}
