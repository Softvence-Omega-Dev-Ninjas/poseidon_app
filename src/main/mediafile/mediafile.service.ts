import { HttpException, Injectable } from '@nestjs/common';
import { cResponseData } from 'src/common/utils/common-responseData';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';

@Injectable()
export class MediafileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findByMedia(id: string) {
    const data = await this.prisma.media.findFirst({
      where: {
        id,
      },
    });
    if (data && data.id)
      return cResponseData({
        message: 'Media file found successfully',
        data,
      });
    throw new HttpException(
      cResponseData({
        message: 'Media file not found',
        data: null,
      }),
      404,
    );
  }

  async findById(id: string) {
    const data = await this.prisma.media.findUnique({
      where: {
        id,
      },
    });
    return data;
  }

  async deleteFile(id: string) {
    const deleteData = await this.prisma.media.delete({
      where: {
        id,
      },
    });
    return deleteData;
  }

  // use to Only for membership levels card by delete apis
  async deleteMembershipImage(id: string) {
    const mediaData = await this.findById(id);
    // console.log(mediaData);
    if (!(mediaData && mediaData.id) || !(mediaData && mediaData.publicId))
      throw new HttpException(
        cResponseData({
          message: 'Media file not found',
          data: null,
        }),
        404,
      );
    const deletecloudinary: { result: string } =
      await this.cloudinaryService.deleteFile(mediaData?.publicId as string);
    if (deletecloudinary.result == 'ok') {
      const dltFile = await this.deleteFile(mediaData.id);
      if (dltFile && dltFile.id) {
        return {
          message: 'File deleted successfully',
          data: id,
          success: true,
        };
      }
      return {
        message: 'Something went wrong',
        data: null,
        success: false,
      };
    }
    return {
      message: 'Something went wrong',
      data: null,
    };
  }
}
