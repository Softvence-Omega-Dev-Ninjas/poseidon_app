import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import { UploadResponseDto } from './dto';
import { v4 as uuidv4 } from 'uuid';
import * as streamifier from 'streamifier';
import { UploadsRepository } from './uploads.repository';
export type Cloudinary = typeof cloudinary;

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY') private cloudinary: Cloudinary,
    private readonly repository: UploadsRepository,
  ) {}

  /** Upload multiple files */
  async uploadFiles(
    files: Express.Multer.File[],
  ): Promise<UploadResponseDto[]> {
    const results: UploadResponseDto[] = [];
    for (const file of files) {
      results.push(await this.uploadFile(file));
    }

    return results;
  }
  /** Upload single file */
  private async uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Generate unique filename
    const ext = file.originalname.split('.').pop();
    const folder = this.getFolderByMimeType(file.mimetype);
    const uniqueName = `${uuidv4()}.${ext}`;
    const publicId = `${folder}/${uniqueName}`;

    try {
      const uploadRes = await this.uploadToCloudinary(file, publicId);
      console.log(uploadRes);
      if (!uploadRes.secure_url)
        throw new ConflictException('Fail to upload file!');

      // Save to Prisma media table
      await this.repository.store(uploadRes as UploadApiResponse);

      const result: UploadResponseDto = {
        originalName: file.originalname,
        type: file.mimetype,
        size: file.size,
        url: uploadRes.secure_url,
      };
      return result;
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to upload file to Cloudinary',
      );
    }
  }

  /** Delete file by publicId */
  async deleteFile(publicId: string) {
    try {
      return await this.cloudinary.uploader.destroy(publicId, {
        resource_type: 'auto',
      });
    } catch (err) {
      console.error('Cloudinary deletion error:', err);
      throw new InternalServerErrorException(
        'Failed to delete file from Cloudinary',
      );
    }
  }

  /** Generic Cloudinary upload using in-memory buffer */
  private uploadToCloudinary(
    file: Express.Multer.File,
    publicId: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        { public_id: publicId, resource_type: 'auto' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as UploadApiResponse);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  /** Determine folder based on MIME type */
  private getFolderByMimeType(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'images';
    if (mimeType.startsWith('video/')) return 'videos';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'documents';
  }
}
