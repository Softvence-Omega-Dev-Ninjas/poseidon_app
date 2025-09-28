import { Controller, Get, Req } from '@nestjs/common';
import { ReferralService } from './suppoter-dsahboard.service';

import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { cResponseData } from 'src/common/utils/common-responseData';


@Controller('referral')
export class ReferralController {
  constructor(private referralService: ReferralService) { }

  // Referral link
  @Roles(Role.User, Role.Supporter)
  @Get('create-referral-link')
  async getReferralLink(@Req() req: Request) {
    return cResponseData({ message: 'Referral link created successfully', data: req['sub'] as string })
  };

  @Roles(Role.User, Role.Supporter)
  @Get('sing-ups')
  async getSingUps(@Req() req: Request) {
    return this.referralService.getSignUps(req['sub'] as string)
  };


}

