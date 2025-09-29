import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as argon2 from 'argon2';

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
    try {
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
        try {
          const upload = await this.cloudinary.profileImageUpload(file);
          uploadedImageUrl = upload.imageUrl;
        } catch (err) {
          throw new InternalServerErrorException(
            'Failed to upload profile image',
          );
        }
      }

      // 3. If profile exists → update, else → create
      let profile;
      if (user.profile) {
        profile = await this.prisma.profile.update({
          where: { userid: userId },
          data: {
            name: updateData.name?.trim() || user.profile.name,
            country: updateData.country?.trim() || user.profile.country,
            image: uploadedImageUrl?.trim() || user.profile.image,
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
    } catch (error) {
      // Let known NestJS exceptions bubble up
      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      // Unexpected errors
      throw new InternalServerErrorException(
        error?.message || 'Something went wrong while updating profile',
      );
    }
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.password) {
        throw new NotFoundException('User has no password');
      }

      // 1. Verify current password
      const isMatch = await argon2.verify(user.password, dto.currentPassword);
      if (!isMatch) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      // 2. Hash new password
      const hashedPassword = await argon2.hash(dto.newPassword);

      // 3. Update in DB
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return {
        success: true,
        message: 'Password updated successfully',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        error?.message || 'Something went wrong while updating password',
      );
    }
  }
}
