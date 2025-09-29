import {
  BadRequestException,
  Body,
  Controller,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileSettingService } from './profile-setting.service';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Role } from 'src/auth/guard/role.enum';
import { Roles } from 'src/auth/guard/roles.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';

@ApiTags('Profile Setting')
@Controller('profile-setting')
export class ProfileSettingController {
  constructor(private readonly profileSettingService: ProfileSettingService) {}

  @ApiOperation({ summary: 'Update profile' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB Max
      fileFilter: (req, file, callback) => {
        // Accept only image mimetype
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  @Roles(Role.Supporter, Role.User)
  @Patch()
  update(
    @Body() dto: UpdateProfileDto,
    @Req() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.profileSettingService.updateProfile(req?.sub, dto, file);
  }

  @ApiOperation({ summary: 'Update password' })
  @Roles(Role.Supporter, Role.User)
  @Patch('update-password')
  async updatePassword(@Req() req: any, @Body() dto: UpdatePasswordDto) {
    return this.profileSettingService.updatePassword(req?.sub, dto);
  }
}
