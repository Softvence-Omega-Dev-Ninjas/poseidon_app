import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindAllPostsDto, PostSortBy } from './dto/find-all-posts.dto';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import { Post, Prisma } from '../../../generated/prisma';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService, private cloudinaryService: CloudinaryService) {}

  async create(createPostDto: CreatePostDto, userId: string, files?: Array<Express.Multer.File>): Promise<Post> {
    const mediaIds: string[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const uploadRes = await this.cloudinaryService.imageUpload(file);
        mediaIds.push(uploadRes.mediaId);
      }
    }

    return this.prisma.post.create({
      data: {
        ...createPostDto,
        userId,
        images: mediaIds,
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

async update(id: string, dto: UpdatePostDto, files: Express.Multer.File[], userId: string) {
  const post = await this.prisma.post.findUnique({ where: { id } });
  if (!post) throw new NotFoundException('Post not found');

  const updatedImages = [...(post.images || [])];

  // Handle image actions
  if (dto.images?.length) {
    for (const { action, value } of dto.images) {
      if (action === 'add' && !updatedImages.includes(value)) {
        updatedImages.push(value);
      } else if (action === 'remove') {
        const index = updatedImages.indexOf(value);
        if (index > -1) updatedImages.splice(index, 1);
      }
    }
  }

  // Handle new uploaded images (Cloudinary, etc.)
  // if (files?.length) {
  //   for (const file of files) {
  //     const uploaded = await this.cloudinaryService.imageUpload(file); // returns secure_url
  //     updatedImages.push(uploaded.secure_url);
  //   }
  // }

  return this.prisma.post.update({
    where: { id },
    data: {
      ...dto,
      images: updatedImages,
    },
  });
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

    // Delete associated media from Cloudinary and database
    for (const mediaId of post.images) {
      const media = await this.prisma.media.findUnique({ where: { id: mediaId } });
      if (media) {
        await this.cloudinaryService.deleteFile(media.publicId);
        await this.prisma.media.delete({ where: { id: media.id } });
      }
    }

    return this.prisma.post.delete({
      where: { id },
    });
  }
}
