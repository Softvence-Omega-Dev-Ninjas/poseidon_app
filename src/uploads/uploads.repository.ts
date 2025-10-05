import { Injectable } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class UploadsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async store(input: UploadApiResponse) {
    return await this.prisma.media.createMany({
      data: {
        imageUrl: input.secure_url,
        publicId: input.public_id,
      },
      skipDuplicates: true,
    });
  }
}
