import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Cloudinary } from './cloudinaryConfig.types';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private cloudinary: Cloudinary) {}

  async imageUpload(file?: Express.Multer.File) {
    try {
      if (file) {
        const uploadRes = await this.cloudinary.uploader.upload(file.path, {
          public_id: file.originalname,
        });
        return {
          imageUrl: uploadRes.secure_url,
          publicId: uploadRes.public_id,
        };
      }
    } catch (err) {
      console.error('Error uploading quote:', err);
      throw new InternalServerErrorException('Failed to upload Image');
    }
  }

  // remove file with cloudinary
  async deleteFile(publicId: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.cloudinary.uploader.destroy(publicId, {});
      console.log('Deleted:', result);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result;
    } catch (error) {
      console.error('Cloudinary deletion error:', error);
      throw new InternalServerErrorException(
        'Failed to delete file from Cloudinary',
      );
    }
  }
}
