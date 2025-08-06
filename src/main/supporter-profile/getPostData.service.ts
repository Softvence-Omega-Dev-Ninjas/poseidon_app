import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class GetPostDataService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllPost(user_id: string) {
    return this.prisma.post.findMany({
      where: {
        userId: user_id,
        whoCanSee: 'PUBLIC',
        drafted: false,
      },
      select: {
        images: true,
        description: true,
        createdAt: true,
        view: true,
      },
    });
  }
}
