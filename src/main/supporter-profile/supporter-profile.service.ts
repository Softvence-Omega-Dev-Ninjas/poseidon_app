import { HttpException, Injectable } from '@nestjs/common';
import { cResponseData } from 'src/common/utils/common-responseData';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { SellerService } from 'src/utils/stripe/seller.service';
// import { GetShopDataService } from './getShopData.service';

@Injectable()
export class SupporterProfileService {
  constructor(
    private readonly prisma: PrismaService,
    // private readonly getShopDataService: GetShopDataService,
    private readonly stripeSellerService: SellerService,
  ) {}
  private async getMedia(mediaIds: string[]) {
    if (!mediaIds || mediaIds.length === 0) {
      return [];
    }
    const media = await this.prisma.media.findMany({
      where: {
        id: {
          in: mediaIds,
        },
      },
    });
    return media;
  }
  private async getSingleMedia(mediaIds: string) {
    const media = await this.prisma.media.findFirst({
      where: {
        id: mediaIds,
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
        username: true,
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

  async profilePage(username: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        username: username,
        role: 'supporter',
      },
      select: {
        id: true,
        username: true,
        stripeAccountId: true,
      },
    });
    const stripeCompleted: { stripe: boolean } = {
      stripe: false,
    };

    if (user && user.stripeAccountId) {
      const result = await this.stripeSellerService.checkAccountsInfoSystem(
        user.stripeAccountId,
      );
      stripeCompleted.stripe = result;
    }

    return await this.prisma.$transaction(async (tx) => {
      if (!user || !user.id) {
        throw new HttpException(
          cResponseData({
            message: 'User not found',
            error: 'User not found',
            data: null,
            success: false,
          }),
          400,
        );
      }

      const userid = user.id;
      // // console.log('userssssssssssss ', user);
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

      // total supporter count
      const totalSupporter = await tx.supporterPay.count({
        where: {
          author_id: userid,
          paymemtStatus: 'paid',
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
          default_price: true,
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
          id: true,
          images: true,
          description: true,
          createdAt: true,
          view: true,
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
            where: {
              isPublic: true,
            },
            take: 3,
            select: {
              id: true,
              levelName: true,
              levelImage: true,
              titleName: true,
              MembershipSubscriptionPlan: {
                select: {
                  id: true,
                  duration: true,
                  price: true,
                  CalligSubscriptionPlan: {
                    select: {
                      id: true,
                      title: true,
                      unlimitedVideoCalls: true,
                      totalVideoCalls: true,
                    },
                  },
                  MessagesSubscriptionPlan: {
                    select: {
                      id: true,
                      title: true,
                      unlimitedMessages: true,
                      totalMessages: true,
                    },
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
          visibility: 'PUBLIC',
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
        userid: userid,
        username: user.username,
        financial_account: stripeCompleted.stripe,
        totalSupporter,
        profileInfo: {
          ...profileInfo,
          cover_image: profileInfo?.cover_image
            ? await this.getSingleMedia(profileInfo?.cover_image)
            : null,
        },
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

  async findByIDUser(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });
    return user;
  }
}
