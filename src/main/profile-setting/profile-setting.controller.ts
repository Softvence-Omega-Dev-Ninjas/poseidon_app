import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
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
import { Request } from 'express';

@ApiTags('Profile Setting')
@Controller('profile-setting')
export class ProfileSettingController {
  constructor(private readonly profileSettingService: ProfileSettingService) {}

  @ApiOperation({ summary: 'Get profile' })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  @Get()
  getProfile(@Req() req: Request) {
    return this.profileSettingService.getProfile(req['sub'] as string);
  }

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
  @Roles(Role.Admin, Role.Supporter, Role.User)
  @Patch()
  update(
    @Body() dto: UpdateProfileDto,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.profileSettingService.updateProfile(
      req['sub'] as string,
      dto,
      file,
    );
  }

  @ApiOperation({ summary: 'Update password' })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  @Patch('update-password')
  async updatePassword(@Req() req: Request, @Body() dto: UpdatePasswordDto) {
    return this.profileSettingService.updatePassword(req['sub'] as string, dto);
  }

  @ApiOperation({ summary: 'Delete account' })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  @Delete('delete-account')
  async deleteAccount(@Req() req: Request) {
    return this.profileSettingService.deleteAccount(req['sub'] as string);
  }
}
