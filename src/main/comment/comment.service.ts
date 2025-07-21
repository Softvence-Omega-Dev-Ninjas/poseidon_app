import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from '../../../generated/prisma';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.prisma.comment.create({ data: createCommentDto });
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    if (comment.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this comment.',
      );
    }
    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
    });
  }

  async getCommentCountForPost(postId: string): Promise<number> {
    return this.prisma.comment.count({
      where: { postId },
    });
  }
}
