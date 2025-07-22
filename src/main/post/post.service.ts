import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindAllPostsDto, PostSortBy } from './dto/find-all-posts.dto';
import { Post, Prisma } from '../../../generated/prisma';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        userId,
      },
    });
  }

  async findAll(
    query: FindAllPostsDto,
    userId?: string,
  ): Promise<
    { data: (Post & { isLiked?: boolean })[]; total: number; currentPage: number; limit: number; totalPages: number } | (Post & { isLiked?: boolean })[]
  > {
    const { page = 1, limit = 10, sortBy = PostSortBy.NEWEST } = query;
    const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
    const limitNumber = typeof limit === 'string' ? parseInt(limit, 10) : limit;
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

    const [posts, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        skip: offset,
        take: parseInt(limit as any),
        orderBy,
        include: { likes: { where: { userId } } },
      }),
      this.prisma.post.count(),
    ]);

    const postsWithIsLiked = posts.map((post) => {
      const { likes, ...rest } = post;
      return { ...rest, isLiked: likes.length > 0 };
    });

    const totalPages = Math.ceil(total / limitNumber);

    return {
      data: postsWithIsLiked,
      total,
      currentPage: pageNumber,
      limit: limitNumber,
      totalPages,
    };
  }

  async findOne(id: string, userId?: string): Promise<Post & { isLiked?: boolean }> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { likes: { where: { userId } } },
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    // Increment view count
    await this.prisma.post.update({
      where: { id },
      data: { view: { increment: 1 } },
    });

    const { likes, ...rest } = post;
    return { ...rest, isLiked: likes.length > 0 };
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const { images, ...restOfUpdateDto } = updatePostDto;
    let updatedImages: string[] | undefined;

    if (images) {
      const existingPost = await this.prisma.post.findUnique({
        where: { id },
        select: { images: true },
      });

      if (!existingPost) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      updatedImages = [...existingPost.images];

      for (const imageAction of images) {
        if (imageAction.action === 'add') {
          updatedImages.push(imageAction.value);
        } else if (imageAction.action === 'delete') {
          updatedImages = updatedImages.filter(
            (img) => img !== imageAction.value,
          );
        }
      }
    }

    const post = await this.prisma.post.update({
      where: { id },
      data: {
        ...restOfUpdateDto,
        ...(updatedImages !== undefined && { images: updatedImages }),
      },
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async remove(id: string, userId: string): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    if (post.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to delete this post.',
      );
    }
    return this.prisma.post.delete({
      where: { id },
    });
  }
}
