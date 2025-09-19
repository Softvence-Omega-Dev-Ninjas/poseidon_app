import { HttpException, Injectable } from '@nestjs/common';
import { cResponseData } from 'src/common/utils/common-responseData';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { MediafileService } from '../mediafile/mediafile.service';

@Injectable()
export class CoverPhotoChangeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediafileService: MediafileService,
  ) {}
  async changeCoverPhotoSupporterProfile(
    userId: string,
    image?: Express.Multer.File,
  ) {
    if (!image)
      return cResponseData({
        message: 'Image not found',
        data: null,
        success: false,
      });
    return await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirst({
        where: {
          id: userId,
          role: 'supporter',
        },
        select: {
          id: true,
          username: true,
          profile: {
            select: {
              cover_image: true,
            },
          },
        },
      });
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
      // only upload image and upadte profile cover image
      if (user && !user.profile?.cover_image) {
        const uploadImage =
          await this.mediafileService.fullUploadFileSystem(image);

        if (!uploadImage) {
          throw new HttpException(
            cResponseData({
              message: 'Image not uploaded',
              error: 'Image not uploaded',
              data: null,
              success: false,
            }),
            400,
          );
        }
        const profile = await tx.profile.update({
          where: {
            userid: userId,
          },
          data: {
            cover_image: uploadImage.id,
          },
          select: {
            cover_image: true,
          },
        });
        if (!profile) {
          throw new HttpException(
            cResponseData({
              message: 'Profile not cover image Not Updated',
              error: 'Profile not found',
              data: null,
              success: false,
            }),
            400,
          );
        }
        return cResponseData({
          message: 'Profile cover image updated',
          data: uploadImage,
          success: true,
        });
      }

      //   remove images with coudinary and media tb
      const mediaData = await this.mediafileService.fullDeleteFileSystem(
        user.profile?.cover_image as string,
      );
      if (!mediaData || !mediaData.success) {
        throw new HttpException(
          cResponseData({
            message: mediaData.massage,
            error: 'Image not deleted - something wrong',
            data: null,
            success: false,
          }),
          400,
        );
      }

      const uploadImage =
        await this.mediafileService.fullUploadFileSystem(image);
      if (!uploadImage || !uploadImage.id) {
        throw new HttpException(
          cResponseData({
            message: 'Image not uploaded',
            error: 'Image not uploaded',
            data: null,
            success: false,
          }),
          400,
        );
      }

      const profile = await tx.profile.update({
        where: {
          userid: userId,
        },
        data: {
          cover_image: uploadImage.id,
        },
        select: {
          cover_image: true,
        },
      });
      if (!profile) {
        throw new HttpException(
          cResponseData({
            message: 'Profile not cover image Not Updated',
            error: 'Profile not found',
            data: null,
            success: false,
          }),
          400,
        );
      }
      return cResponseData({
        message: 'Profile cover image updated',
        data: uploadImage,
        success: true,
      });
    });
  }
}
