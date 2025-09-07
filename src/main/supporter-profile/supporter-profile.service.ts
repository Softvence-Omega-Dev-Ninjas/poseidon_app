import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
// import { GetShopDataService } from './getShopData.service';

@Injectable()
export class SupporterProfileService {
  constructor(
    private readonly prisma: PrismaService,
    // private readonly getShopDataService: GetShopDataService,
  ) {}

  async findAllUsers() {
    const allUserSupporter = await this.prisma.user.findMany({
      where: {
        role: 'supporter',
      },
      select: {
        id: true,
        profile: {
          select: {
            name: true,
            image: true,
            description: true,
          },
        },
        _count: {
          select: { supporter: true },
        },
      },
    });
    return allUserSupporter;
  }

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
        include: {
          cheers_live_package_type: true,
          SuggestQuantity: true,
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
      // membershipInfo
      const membershipInfo = await tx.membership_owner.findFirst({
        where: {
          ownerId: userid,
        },
        select: {
          id: true,
          Membership_levels: {
            take: 3,
            select: {
              id: true,
              levelName: true,
              levelImage: true,
              MembershipSubscriptionPlan: {
                select: {
                  id: true,
                  duration: true,
                  price: true,
                  CalligSubscriptionPlan: {
                    select: {
                      id: true,
                      title: true,
                    },
                  },
                  MessagesSubscriptionPlan: {
                    select: { id: true, title: true },
                  },
                  GallerySubscriptionPlan: {
                    select: { id: true, title: true },
                  },
                  PostsSubscriptionPlan: { select: { id: true, title: true } },
                },
              },
            },
          },
        },
      });
      // gallery
      const gallery = await tx.image.findMany({
        where: {
          userId: userid,
        },
        select: {
          id: true,
          media: true,
          likeCount: true,
          commentCount: true,
          createdAt: true,
        },
      });
      return {
        profileInfo,
        supporte_card,
        shopid: shopid ? shopid.id : null,
        posts,
        membershipInfo,
        image: gallery,
      };
    });
  }
}
