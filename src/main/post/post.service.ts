import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindAllPostsDto, PostSortBy } from './dto/find-all-posts.dto';
import { Post, Prisma } from '../../../generated/prisma';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const { authorId, ...rest } = createPostDto;
    return this.prisma.post.create({
      data: {
        ...rest,
        userId: authorId, // Map authorId to userId for the relation
      },
    });
  }

  async findAll(query: FindAllPostsDto): Promise<{ data: Post[]; total: number; page: number; lastPage: number } | Post[]> {
    const { page = 1, limit = 10, sortBy = PostSortBy.NEWEST } = query;
    const offset = (page - 1) * limit;

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
      }),
      this.prisma.post.count(),
    ]);

    const lastPage = Math.ceil(total / limit);

    return {
      data: posts,
      total,
      page,
      lastPage,
    };
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    // Increment view count
    await this.prisma.post.update({
      where: { id },
      data: { view: { increment: 1 } },
    });
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const { images, authorId, ...restOfUpdateDto } = updatePostDto;
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
          updatedImages = updatedImages.filter(img => img !== imageAction.value);
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
      throw new ForbiddenException('You are not authorized to delete this post.');
    }
    return this.prisma.post.delete({
      where: { id },
    });
  }
}
