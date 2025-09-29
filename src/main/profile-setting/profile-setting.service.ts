import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class ProfileSettingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async updateProfile(
    userId: string,
    updateData: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    // 1. Ensure the user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Handle profile image upload if file is provided
    let uploadedImageUrl: string | undefined;
    if (file) {
      const upload = await this.cloudinary.profileImageUpload(file);
      uploadedImageUrl = upload.imageUrl;
    }

    // 3. If profile exists → update, else → create
    let profile;
    if (user.profile) {
      profile = await this.prisma.profile.update({
        where: { userid: userId },
        data: {
          name: updateData.name?.trim() ? updateData.name : user.profile.name,
          country: updateData.country?.trim()
            ? updateData.country
            : user.profile.country,
          image: uploadedImageUrl?.trim()
            ? uploadedImageUrl
            : user.profile.image,
        },
      });
    } else {
      profile = await this.prisma.profile.create({
        data: {
          userid: userId,
          name: updateData.name ?? '',
          country: updateData.country ?? '',
          image: uploadedImageUrl ?? '',
        },
      });
    }

    return {
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    };
  }
}
