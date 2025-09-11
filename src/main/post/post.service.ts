import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindAllPostsDto, PostSortBy } from './dto/find-all-posts.dto';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import { Post, Prisma } from '../../../generated/prisma';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FindAllCommentsDto } from './dto/find-all-comments.dto';
import { cResponseData } from 'src/common/utils/common-responseData';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) { }

  async create(
    createPostDto: CreatePostDto,
    userId: string,
    files?: Array<Express.Multer.File>,
  ): Promise<any> {
    try {
      const mediaIds: string[] = [];

      if (files && files.length > 0) {
        for (const file of files) {
          const uploadRes = await this.cloudinaryService.imageUpload(file);
          mediaIds.push(uploadRes.mediaId);
        }
      }

      const newPost = await this.prisma.post.create({
        data: {
          ...createPostDto,
          userId,
          images: mediaIds,
        },
      });
      return cResponseData({
        message: 'Post created successfully.',
        error: null,
        data: newPost,
        success: true,
      });
    } catch (error) {
      return cResponseData({
        message: 'Failed to create post.',
        error: error.message,
        data: null,
        success: false,
      });
    }
  }

  // async findAll(query: FindAllPostsDto, userId?: string): Promise<any> {
  //   try {
  //     const {
  //       page = 1,
  //       limit = 10,
  //       sortBy = PostSortBy.NEWEST,
  //       whoCanSee,
  //     } = query;
  //     const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
  //     const limitNumber =
  //       typeof limit === 'string' ? parseInt(limit, 10) : limit;
  //     const offset = (pageNumber - 1) * limitNumber;

  //     let orderBy: Prisma.PostOrderByWithRelationInput;
  //     switch (sortBy) {
  //       case PostSortBy.VIEWED:
  //         orderBy = { view: 'desc' };
  //         break;
  //       case PostSortBy.LIKED:
  //         orderBy = { likes: { _count: 'desc' } };
  //         break;
  //       case PostSortBy.NEWEST:
  //       default:
  //         orderBy = { createdAt: 'desc' };
  //         break;
  //     }

  //     const where: Prisma.PostWhereInput = {};
  //     if (whoCanSee) {
  //       where.whoCanSee = whoCanSee;
  //     }

  //     const [posts, total] = await this.prisma.$transaction([
  //       this.prisma.post.findMany({
  //         where,
  //         skip: offset,
  //         take: parseInt(limit as any),
  //         orderBy,
  //         include: { likes: { where: { userId } }, },
  //       }),
  //       this.prisma.post.count({ where }),
  //     ]);

  //     const postsWithIsLiked = posts.map((post) => {
  //       const { likes, ...rest } = post;
  //       return { ...rest, isLiked: likes.length > 0 };
  //     });

  //     const totalPages = Math.ceil(total / limitNumber);

  //     return cResponseData({
  //       message: 'Posts retrieved successfully.',
  //       error: null,
  //       data: {
  //         data: postsWithIsLiked,
  //         total,
  //         currentPage: pageNumber,
  //         limit: limitNumber,
  //         totalPages,
  //       },
  //       success: true,
  //     });
  //   } catch (error) {
  //     return cResponseData({
  //       message: 'Failed to retrieve posts.',
  //       error: error.message,
  //       data: null,
  //       success: false,
  //     });
  //   }
  // }

  async findAll(query: FindAllPostsDto, userId?: string): Promise<any> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = PostSortBy.NEWEST,
        whoCanSee,
      } = query;

      const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
      const limitNumber =
        typeof limit === 'string' ? parseInt(limit, 10) : limit;
      const offset = (pageNumber - 1) * limitNumber;

      let orderBy: Prisma.PostOrderByWithRelationInput;
      switch (sortBy) {
        case PostSortBy.VIEWED:
          orderBy = { view: 'desc' };
          break;
        case PostSortBy.LIKED:
          orderBy = { likes: { _count: 'desc' } };
          break;
        case PostSortBy.NEWEST:
        default:
          orderBy = { createdAt: 'desc' };
          break;
      }

      const where: Prisma.PostWhereInput = {};
      if (whoCanSee) {
        where.whoCanSee = whoCanSee;
      }
      if (userId) {
        where.userId = userId;
      }

      const [posts, total] = await this.prisma.$transaction([
        this.prisma.post.findMany({
          where,
          skip: offset,
          take: limitNumber,
          orderBy,
          include: {
            likes: { where: { userId } },
            user: true, // optional: include user info
          },
        }),
        this.prisma.post.count({ where }),
      ]);

      // 🔥 Collect all mediaIds from all posts
      const allMediaIds = posts.flatMap((p) => p.images);

      // Fetch media
      const medias = await this.prisma.media.findMany({
        where: { id: { in: allMediaIds } },
      });

      const mediaMap = new Map(medias.map((m) => [m.id, m]));

      // Build posts response
      const postsWithExtras = posts.map((post) => {
        const { likes, ...rest } = post;
        return {
          ...rest,
          isLiked: likes.length > 0,
          media: post.images.map((id) => mediaMap.get(id)).filter(Boolean),
        };
      });

      const totalPages = Math.ceil(total / limitNumber);

      return cResponseData({
        message: 'Posts retrieved successfully.',
        error: null,
        data: {
          data: postsWithExtras,
          total,
          currentPage: pageNumber,
          limit: limitNumber,
          totalPages,
        },
        success: true,
      });
    } catch (error) {
      return cResponseData({
        message: 'Failed to retrieve posts.',
        error: error.message,
        data: null,
        success: false,
      });
    }
  }

  // async findOne(id: string, userId?: string): Promise<any> {
  //   try {
  //     const post = await this.prisma.post.findUnique({
  //       where: { id },
  //       include: { likes: { where: { userId } } },
  //     });
  //     if (!post) {
  //       return {
  //         message: `Post with ID ${id} not found`,
  //         redirect_url: null,
  //         error: 'NotFound',
  //         data: null,
  //         success: false,
  //       };
  //     }
  //     // Increment view count
  //     await this.prisma.post.update({
  //       where: { id },
  //       data: { view: { increment: 1 } },
  //     });

  //     const { likes, ...rest } = post;
  //     return cResponseData({
  //       message: 'Post retrieved successfully.',
  //       error: null,
  //       data: { ...rest, isLiked: likes.length > 0 },
  //       success: true,
  //     });
  //   } catch (error) {
  //     return cResponseData({
  //       message: 'Failed to retrieve post.',
  //       error: error.message,
  //       data: null,
  //       success: false,
  //     });
  //   }
  // }

  async findOne(id: string, userId?: string): Promise<any> {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
        include: {
          likes: { where: { userId } },
          user: true,
        },
      });

      if (!post) {
        return {
          message: `Post with ID ${id} not found`,
          redirect_url: null,
          error: 'NotFound',
          data: null,
          success: false,
        };
      }

      await this.prisma.post.update({
        where: { id },
        data: { view: { increment: 1 } },
      });

      const medias = await this.prisma.media.findMany({
        where: { id: { in: post.images } },
      });

      const { likes, ...rest } = post;
      return cResponseData({
        message: 'Post retrieved successfully.',
        error: null,
        data: {
          ...rest,
          isLiked: likes.length > 0,
          media: post.images
            .map((id) => medias.find((m) => m.id === id))
            .filter(Boolean),
        },
        success: true,
      });
    } catch (error) {
      return cResponseData({
        message: 'Failed to retrieve post.',
        error: error.message,
        data: null,
        success: false,
      });
    }
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    newImages: Express.Multer.File[],
    userId: string,
  ): Promise<any> {
    try {
      const post = await this.prisma.post.findUnique({ where: { id } });

      if (!post) {
        return cResponseData({
          message: 'Post not found',
          error: 'NotFound',
          data: null,
          success: false,
        });
      }

      if (post.userId !== userId) {
        return cResponseData({
          message: 'You are not authorized to update this post.',
          error: 'Forbidden',
          data: null,
          success: false,
        });
      }

      const currentImages = post.images || [];
      let updatedImages = [...currentImages];

      // Handle images to remove
      if (updatePostDto.images && updatePostDto.images.length > 0) {
        for (const mediaId of updatePostDto.images) {
          const media = await this.prisma.media.findUnique({
            where: { id: mediaId },
          });
          if (media) {
            await this.cloudinaryService.deleteFile(media.publicId);
            await this.prisma.media.delete({ where: { id: media.id } });
            updatedImages = updatedImages.filter((img) => img !== mediaId);
          }
        }
      }

      // Handle new images to upload
      if (newImages && newImages.length > 0) {
        for (const file of newImages) {
          const uploadRes = await this.cloudinaryService.imageUpload(file);
          updatedImages.push(uploadRes.mediaId);
        }
      }

      // Create a new object for the update data, excluding the 'images' field from the DTO
      const { images, ...updateData } = updatePostDto;

      const updatedPost = await this.prisma.post.update({
        where: { id },
        data: {
          ...updateData,
          images: updatedImages,
        },
      });

      return cResponseData({
        message: 'Post updated successfully.',
        error: null,
        data: updatedPost,
        success: true,
      });
    } catch (error) {
      return cResponseData({
        message: 'Failed to update post.',
        error: error.message,
        data: null,
        success: false,
      });
    }
  }

  async remove(id: string, userId: string): Promise<any> {
    try {
      // 1️⃣ Find the post
      const post = await this.prisma.post.findUnique({
        where: { id },
      });

      if (!post) {
        return cResponseData({
          message: `Post with ID ${id} not found`,
          error: 'NotFound',
          data: null,
          success: false,
        });
      }

      if (post.userId !== userId) {
        return cResponseData({
          message: 'You are not authorized to delete this post.',
          error: 'Forbidden',
          data: null,
          success: false,
        });
      }

      for (const mediaId of post.images) {
        const media = await this.prisma.media.findUnique({
          where: { id: mediaId },
        });
        if (media) {
          await this.cloudinaryService.deleteFile(media.publicId);
          await this.prisma.media.delete({ where: { id: media.id } });
        }
      }

      const deleteCommentsRecursively = async (commentId: string) => {
        const comment = await this.prisma.comment.findUnique({
          where: { id: commentId },
          include: { replies: true },
        });

        if (!comment) return;

        for (const reply of comment.replies) {
          await deleteCommentsRecursively(reply.id);
        }

        await this.prisma.comment.delete({ where: { id: comment.id } });
      };

      const topComments = await this.prisma.comment.findMany({
        where: { postId: id, parentId: null },
        include: { replies: true },
      });

      for (const comment of topComments) {
        await deleteCommentsRecursively(comment.id);
      }

      await this.prisma.like.deleteMany({ where: { postId: id } });

      const deletedPost = await this.prisma.post.delete({ where: { id } });

      return cResponseData({
        message: 'Post deleted successfully.',
        error: null,
        data: deletedPost,
        success: true,
      });
    } catch (error) {
      return cResponseData({
        message: 'Failed to delete post.',
        error: error.message,
        data: null,
        success: false,
      });
    }
  }

  async createLike(postId: string, userId: string): Promise<any> {
    try {
      const newLike = await this.prisma.$transaction(async (prisma) => {
        const like = await prisma.like.create({
          data: { userId, postId },
        });

        await prisma.post.update({
          where: { id: postId },
          data: { likeCount: { increment: 1 } },
        });
        return like;
      });
      return cResponseData({
        message: 'Post liked successfully.',
        error: null,
        data: newLike,
        success: true,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return cResponseData({
          message: 'User has already liked this post.',
          error: 'Conflict',
          data: null,
          success: false,
        });
      }
      return cResponseData({
        message: 'Failed to like post.',
        error: error.message,
        data: null,
        success: false,
      });
    }
  }

  async deleteLike(postId: string, userId: string): Promise<any> {
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
      return cResponseData({
        message: 'Like deleted successfully.',
        error: null,
        data: null,
        success: true,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return cResponseData({
          message: 'Like not found.',
          error: 'NotFound',
          data: null,
          success: false,
        });
      }
      return cResponseData({
        message: 'Failed to delete like.',
        error: error.message,
        data: null,
        success: false,
      });
    }
  }

  async createComment(
    postId: string,
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<any> {
    try {
      const newComment = await this.prisma.$transaction(async (prisma) => {
        const comment = await prisma.comment.create({
          data: { ...createCommentDto, postId, userId },
        });

        await prisma.post.update({
          where: { id: postId },
          data: { commentCount: { increment: 1 } },
        });
        return comment;
      });
      return cResponseData({
        message: 'Comment created successfully.',
        error: null,
        data: newComment,
        success: true,
      });
    } catch (error) {
      return cResponseData({
        message: 'Failed to create comment.',
        error: error.message,
        data: null,
        success: false,
      });
    }
  }

  async deleteComment(commentId: string, userId: string): Promise<any> {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: { id: commentId },
      });

      if (!comment) {
        return cResponseData({
          message: `Comment with ID ${commentId} not found`,
          error: 'NotFound',
          data: null,
          success: false,
        });
      }

      if (comment.userId !== userId) {
        return cResponseData({
          message: 'You are not authorized to delete this comment.',
          error: 'Forbidden',
          data: null,
          success: false,
        });
      }

      await this.prisma.$transaction(async (prisma) => {
        await prisma.comment.delete({
          where: { id: commentId },
        });

        await prisma.post.update({
          where: { id: comment.postId },
          data: { commentCount: { decrement: 1 } },
        });
      });
      return cResponseData({
        message: 'Comment deleted successfully.',
        error: null,
        data: null,
        success: true,
      });
    } catch (error) {
      return cResponseData({
        message: 'Failed to delete comment.',
        error: error.message,
        data: null,
        success: false,
      });
    }
  }

  async findAllComments(
    postId: string,
    query: FindAllCommentsDto,
  ): Promise<any> {
    try {
      const { page = 1, limit = 10 } = query;
      const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
      const limitNumber =
        typeof limit === 'string' ? parseInt(limit, 10) : limit;
      const offset = (pageNumber - 1) * limitNumber;

      const [comments, total] = await this.prisma.$transaction([
        this.prisma.comment.findMany({
          where: { postId },
          skip: offset,
          take: limitNumber,
          include: { user: true, replies: true },
        }),
        this.prisma.comment.count({ where: { postId } }),
      ]);

      const totalPages = Math.ceil(total / limitNumber);

      return cResponseData({
        message: 'Comments retrieved successfully.',
        error: null,
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
        message: 'Failed to retrieve comments.',
        error: error.message,
        data: null,
        success: false,
      });
    }
  }

  async findCommentById(commentId: string): Promise<any> {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: { id: commentId },
        include: { user: true, replies: true },
      });

      if (!comment) {
        return cResponseData({
          message: `Comment with ID ${commentId} not found`,
          error: 'NotFound',
          data: null,
          success: false,
        });
      }

      return cResponseData({
        message: 'Comment retrieved successfully.',
        error: null,
        data: comment,
        success: true,
      });
    } catch (error) {
      return cResponseData({
        message: 'Failed to retrieve comment.',
        error: error.message,
        data: null,
        success: false,
      });
    }
  }
}
