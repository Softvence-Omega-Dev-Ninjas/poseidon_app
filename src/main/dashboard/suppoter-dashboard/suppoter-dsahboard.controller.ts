import { Body, Controller, Delete, Get, Put, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ReferralService } from './suppoter-dsahboard.service';

import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { cResponseData } from 'src/common/utils/common-responseData';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ApiBody, ApiConsumes } from '@nestjs/swagger';
// import { ImageValidationPipe } from 'src/common/utils/image-validation.pipe';


@Controller('suppoter-dashboard')
export class ReferralController {
  constructor(private referralService: ReferralService) { }

  // Referral link
  @Roles(Role.User, Role.Supporter)
  @Get('create-referral-link')
  async getReferralLink(@Req() req: Request) {
    return cResponseData({ message: 'Referral link created successfully', data: req['sub'] as string })
  };

  // sign ups with referral link
  @Roles(Role.User, Role.Supporter)
  @Get('referral-sing-ups')
  async getSingUps(@Req() req: Request) {
    return this.referralService.getSignUps(req['sub'] as string)
  };

  // update user account
  // @Roles(Role.User, Role.Supporter)
  // @Put('update-account')
  // @UseInterceptors(FileInterceptor('image'))
  // @ApiConsumes('multipart/form-data')
  // async updateUser(@Req() req, @Body() dto: UpdateAccountDto,
  //   @UploadedFile(new ImageValidationPipe()) image?: Express.Multer.File,) {
  //   return this.referralService.updateUser(req.user.id, dto, image);
  // }

  // @Roles(Role.User, Role.Supporter)
  // @Delete('delete-account') 
  // async deleteAccount(@Req() req) {
  //   return this.referralService.deleteAccount(req.user.id);
  // }

}

