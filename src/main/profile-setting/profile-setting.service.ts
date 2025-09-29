import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileSettingService {
  async updateProfile(
    userId: string,
    updateData: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    console.log('userId', userId);
    console.log('updateData', updateData);
    console.log('file', file);

    return {
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: userId,
        ...updateData,
      },
    };
  }
}
