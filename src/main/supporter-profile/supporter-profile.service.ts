import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
// import { GetShopDataService } from './getShopData.service';

@Injectable()
export class SupporterProfileService {
  constructor(
    private readonly prisma: PrismaService,
    // private readonly getShopDataService: GetShopDataService,
  ) {}
  private async getMedia(mediaIds: string[]) {
    const media = await this.prisma.media.findMany({
      where: {
        id: {
          in: mediaIds,
        },
      },
    });
    return media;
  }

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

      const postImageIds = posts.flatMap((p) => p.images);
      const mediaImages = await this.getMedia(postImageIds);
      const postImageMap = new Map(mediaImages.map((m) => [m.id, m]));

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
      const mImagesIds =
        membershipInfo?.Membership_levels.flatMap((m) => m.levelImage) || [];
      const mImages = await this.getMedia(mImagesIds);
      const mImageMap = new Map(mImages.map((m) => [m.id, m]));
      const Membership_levels = membershipInfo?.Membership_levels.map((m) => ({
        ...m,
        levelImage: mImageMap.get(m.levelImage),
      }));
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
        posts: posts.map((p) => ({
          ...p,
          images: p.images.map((imageId) => postImageMap.get(imageId)),
        })),
        membershipInfo: { ...membershipInfo, Membership_levels },
        image: gallery,
      };
    });
  }
}
