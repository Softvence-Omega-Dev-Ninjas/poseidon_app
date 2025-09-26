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
import { Image, Prisma, Roles, Visibility } from '../../../generated/prisma';
import { CreateImageCommentDto } from './dto/create-image-comment.dto';
import { FindAllImageCommentsDto } from './dto/find-all-image-comments.dto';
import { cResponseData } from 'src/common/utils/common-responseData';

@Injectable()
export class ImageService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createImageDto: CreateImageDto,
    userId: string,
    file: Express.Multer.File,
  ): Promise<any> {
    try {
      let mediaId: string;

      if (file) {
        const uploadRes = await this.cloudinaryService.imageUpload(file);
        mediaId = uploadRes.mediaId;
      } else {
        return cResponseData({
          message: 'Image file is required.',
          success: false,
        });
      }

      const newImage = await this.prisma.image.create({
        data: {
          ...createImageDto,
          userId,
          mediaId,
        },
      });
      return cResponseData({
        message: 'Image created successfully.',
        data: newImage,
        success: true,
      });
    } catch (error) {
      console.log(error);
      return cResponseData({
        message: 'Failed to create image.',
        error: error,
        success: false,
      });
    }
  }

  async findAll(query: FindAllImagesDto, userId?: string): Promise<any> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = ImageSortBy.NEWEST,
        visibility,
      } = query;
      const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
      const limitNumber =
        typeof limit === 'string' ? parseInt(limit, 10) : limit;
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

      if (userId) {
        where.userId = userId;
      }

      const [images, total] = await this.prisma.$transaction([
        this.prisma.image.findMany({
          where,
          skip: offset,
          take: parseInt(limit as any),
          orderBy,
          include: { likes: { where: { userId } }, media: true },
        }),
        this.prisma.image.count({ where }),
      ]);

      const imagesWithIsLiked = images.map((image) => {
        const { likes, ...rest } = image;
        return { ...rest, isLiked: likes.length > 0 };
      });

      const totalPages = Math.ceil(total / limitNumber);
      const data = {
        data: imagesWithIsLiked,
        total,
        currentPage: pageNumber,
        limit: limitNumber,
        totalPages,
      };

      return cResponseData({
        message: 'Images retrieved successfully.',
        data,
        success: true,
      });
    } catch (error) {
      return cResponseData({
        message: error?.message || 'Failed to retrieve images.',
        error: error,
        success: false,
      });
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
      return cResponseData({
        message: 'Image retrieved successfully.',
        data: { ...rest, isLiked: likes.length > 0 },
        success: true,
      });
    } catch (error) {
      return cResponseData({
        message: error.message || 'Failed to retrieve image.',
        error: error,
        success: false,
      });
    }
  }

  async update(
    id: string,
    updateImageDto: UpdateImageDto,
    newImage: Express.Multer.File,
    userId: string,
  ): Promise<any> {
    console.log('id', id);
    console.log('updatemageDto', updateImageDto);
    console.log('newImage', newImage);
    console.log('userId', userId);
    try {
      const image = await this.prisma.image.findUnique({ where: { id } });

      if (!image) {
        throw new NotFoundException('Image not found');
      }

      if (image.userId !== userId) {
        throw new ForbiddenException(
          'You are not authorized to update this image.',
        );
      }

      let updatedMediaId = image.mediaId;
      let oldMedia;

      // Handle new image to upload
      if (newImage) {
        const media = await this.prisma.media.findUnique({
          where: { id: image.mediaId },
        });
        if (media) {
          await this.cloudinaryService.deleteFile(media.publicId);
          oldMedia = media;
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

      if (oldMedia) {
        await this.prisma.media.delete({ where: { id: oldMedia.id } });
      }

      return cResponseData({
        message: 'Image updated successfully.',
        data: updatedImage,
        success: true,
      });
    } catch (error) {
      return cResponseData({
        message: error.message || 'Failed to update image.',
        success: false,
        error,
      });
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
        throw new ForbiddenException(
          'You are not authorized to delete this image.',
        );
      }

      await this.prisma.imageLike.deleteMany({
        where: { imageId: id },
      });

      // Delete associated comments
      await this.prisma.imageComment.deleteMany({
        where: { imageId: id },
      });
      let oldmedia;
      // Delete associated media from Cloudinary and database
      const media = await this.prisma.media.findUnique({
        where: { id: image.mediaId },
      });
      if (media) {
        await this.cloudinaryService.deleteFile(media.publicId);
        oldmedia = media;
      }

      const deletedImage = await this.prisma.image.delete({
        where: { id },
      });

      if (oldmedia) {
        await this.prisma.media.delete({ where: { id: oldmedia.id } });
      }

      return cResponseData({
        message: 'Image deleted successfully.',
        // data: deletedImage,
        success: true,
      });
    } catch (error) {
      return cResponseData({
        message: 'Failed to delete image.',
        error: error,
        success: false,
      });
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
      return cResponseData({
        message: 'Image liked successfully.',
        data: newImageLike,
        success: true,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('User has already liked this image.');
      }
      return cResponseData({
        message: 'Failed to like image.',
        error: error,
        success: false,
      });
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
      return cResponseData({
        message: 'Image like deleted successfully.',
        success: true,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Image like not found.');
      }
      return cResponseData({
        message: 'Failed to delete image like.',
        error: error,
        success: false,
      });
    }
  }

  async createComment(
    imageId: string,
    createImageCommentDto: CreateImageCommentDto,
    userId: string,
  ): Promise<any> {
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
      return cResponseData({
        message: 'Image comment created successfully.',
        data: newImageComment,
        success: true,
      });
    } catch (error) {
      return cResponseData({
        message: 'Failed to create image comment.',
        error: error,
        success: false,
      });
    }
  }

  async deleteComment(
    imageId: string,
    commentId: string,
    userId: string,
  ): Promise<any> {
    try {
      const imageComment = await this.prisma.imageComment.findUnique({
        where: { id: commentId },
      });

      if (!imageComment) {
        throw new NotFoundException(
          `Image comment with ID ${commentId} not found`,
        );
      }

      if (imageComment.userId !== userId) {
        throw new ForbiddenException(
          'You are not authorized to delete this comment.',
        );
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
      return cResponseData({
        message: 'Image comment deleted successfully.',
        success: true,
      });
    } catch (error) {
      return cResponseData({
        message: 'Failed to delete image comment.',
        error: error,
        success: false,
      });
    }
  }

  async findAllComments(
    imageId: string,
    query: FindAllImageCommentsDto,
  ): Promise<any> {
    try {
      const { page = 1, limit = 10 } = query;
      const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
      const limitNumber =
        typeof limit === 'string' ? parseInt(limit, 10) : limit;
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

      return cResponseData({
        message: 'Image comments retrieved successfully.',
        data: {
          data: comments,
          total,
          currentPage: pageNumber,
          limit: limitNumber,
          totalPages,
        },
        success: true,
      });
    } catch (error) {
      return cResponseData({
        message: 'Failed to retrieve image comments.',
        error: error,
        success: false,
      });
    }
  }

  async findCommentById(commentId: string): Promise<any> {
    try {
      const comment = await this.prisma.imageComment.findUnique({
        where: { id: commentId },
        include: { user: true },
      });

      if (!comment) {
        throw new NotFoundException(
          `Image comment with ID ${commentId} not found`,
        );
      }

      return cResponseData({
        message: 'Image comment retrieved successfully.',
        data: comment,
        success: true,
      });
    } catch (error) {
      return cResponseData({
        message: 'Failed to retrieve image comment.',
        error: error,
        success: false,
      });
    }
  }

  async incrementViewCount(id: string): Promise<any> {
    try {
      const image = await this.prisma.image.update({
        where: { id },
        data: { view: { increment: 1 } },
      });
      return cResponseData({
        message: 'Image view count incremented successfully.',
        data: image,
        success: true,
      });
    } catch (error) {
      return cResponseData({
        message: 'Failed to increment image view count.',
        error: error,
        success: false,
      });
    }
  }

  async getImagesByVisibility(
    visibility: Visibility,
    userId?: string,
  ): Promise<any> {
    try {
      const images = await this.prisma.image.findMany({
        where: { visibility },
        include: { likes: { where: { userId } }, media: true },
      });

      const imagesWithIsLiked = images.map((image) => {
        const { likes, ...rest } = image;
        return { ...rest, isLiked: likes.length > 0 };
      });

      return cResponseData({
        message: `Images with visibility ${visibility} retrieved successfully.`,
        data: imagesWithIsLiked,
        success: true,
      });
    } catch (error) {
      return cResponseData({
        message: `Failed to retrieve images with visibility ${visibility}.`,
        error: error,
        success: false,
      });
    }
  }
}
