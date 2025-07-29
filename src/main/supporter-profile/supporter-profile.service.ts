import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { GetShopDataService } from '../product/supporter-profile-pass-data/getShopData.service';

@Injectable()
export class SupporterProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly getShopDataService: GetShopDataService,
  ) {}

  async profilePage(userid: string) {
    return await this.prisma.$transaction(async (tx) => {
      const profileInfo = await tx.profile.findUnique({
        where: {
          userid: userid,
          user: {
            role: 'supporter',
          },
        },
        select: {
          cover_image: true,
          name: true,
          image: true,
          description: true,
        },
      });
      const supporte_card = await tx.supportCartLayout.findFirst({
        where: {
          author_id: userid,
          author: {
            role: 'supporter',
          },
        },
      });
      // shop id
      const shopid = await tx.shop.findFirst({
        where: {
          userId: userid,
          user: {
            role: 'supporter',
          },
        },
        select: {
          id: true,
        },
      });
      // const membership_card = await tx. TODO
      const posts = await tx.post.findMany({
        where: {
          userId: userid,
          whoCanSee: 'PUBLIC',
          user: {
            role: 'supporter',
          },
        },
        select: {
          images: true,
          description: true,
          createdAt: true,
        },
      });
      return {
        profileInfo,
        supporte_card,
        shopid: shopid ? shopid.id : null,
        posts,
      };
    });
  }
}
