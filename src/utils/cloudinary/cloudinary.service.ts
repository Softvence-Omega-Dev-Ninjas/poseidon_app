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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const uploadRes = await this.cloudinary.uploader.upload(file.path, {
          folder: 'quotes',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          public_id: file.originalname,
        });
        // imageUrl = uploadRes.secure_url;
        // publicId = uploadRes.public_id;
        return {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          imageUrl: uploadRes.secure_url,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          publicId: uploadRes.public_id,
        };
      }
    } catch (err) {
      console.error('Error uploading quote:', err);
      throw new InternalServerErrorException('Failed to upload Image');
    }
  }
}
