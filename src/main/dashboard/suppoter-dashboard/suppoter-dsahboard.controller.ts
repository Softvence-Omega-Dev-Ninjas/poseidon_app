import { Controller, Get, Req } from '@nestjs/common';
import { ReferralService } from './suppoter-dsahboard.service';

import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { cResponseData } from 'src/common/utils/common-responseData';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ApiBody, ApiConsumes } from '@nestjs/swagger';
// import { ImageValidationPipe } from 'src/common/utils/image-validation.pipe';

@Controller('suppoter-dashboard')
export class ReferralController {
  constructor(private referralService: ReferralService) {}

  // Referral link
  @Roles(Role.User, Role.Supporter)
  @Get('create-referral-link')
  getReferralLink(@Req() req: Request) {
    return cResponseData({
      message: 'Referral link created successfully',
      data: req['sub'] as string,
    });
  }

  // sign ups with referral link
  @Roles(Role.User, Role.Supporter)
  @Get('referral-sing-ups')
  async getSingUps(@Req() req: Request) {
    return this.referralService.getSignUps(req['sub'] as string);
  }

  @Roles(Role.User, Role.Supporter)
  @Get('total-purchases')
  async getTotalPurchases(@Req() req: Request) {
    return this.referralService.getTotalPurchases(req['sub'] as string);
  }
}
