import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Cloudinary } from './cloudinaryConfig.types';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY') private cloudinary: Cloudinary,
    private readonly prisma: PrismaService,
  ) {}

  // Upload image using in-memory buffer
  async imageUpload(file?: Express.Multer.File): Promise<{ mediaId: string }> {
    try {
      if (!file) return { mediaId: '' };

      const uploadRes = await new Promise<any>((resolve, reject) => {
        const uploadStream = this.cloudinary.uploader.upload_stream(
          {
            public_id: file.originalname,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });

      const media = await this.prisma.media.create({
        data: {
          imageUrl: uploadRes.secure_url,
          publicId: uploadRes.public_id,
        },
      });

      return {
        mediaId: media.id,
      };
    } catch (err) {
      console.error('Error uploading image:', err);
      throw new InternalServerErrorException('Failed to upload Image');
    }
  }

  // this function only for use profile image upload
  async profileImageUpload(
    file?: Express.Multer.File,
  ): Promise<{ imageUrl: string, publicId: string }> {
    try {
      if (!file) return { imageUrl: '', publicId: '' };

      const uploadRes = await new Promise<any>((resolve, reject) => {
        const uploadStream = this.cloudinary.uploader.upload_stream(
          {
            public_id: file.originalname,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });

      return {
        imageUrl: uploadRes.secure_url,
        publicId: uploadRes.public_id,
      };
    } catch (err) {
      console.error('Error uploading image:', err);
      throw new InternalServerErrorException('Failed to upload Image');
    }
  }

  // Delete image from Cloudinary using its public ID
  async deleteFile(publicId: string) {
    try {
      const result = await this.cloudinary.uploader.destroy(publicId);

      return result;
    } catch (error) {
      console.error('Cloudinary deletion error:', error);
      throw new InternalServerErrorException(
        'Failed to delete file from Cloudinary',
      );
    }
  }
}
