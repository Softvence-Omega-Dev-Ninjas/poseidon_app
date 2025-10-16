import { Controller, Get, Param, Req } from '@nestjs/common';
import { ReferralService } from './suppoter-dsahboard.service';

import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { cResponseData } from 'src/common/utils/common-responseData';
import { VideoCallChatService } from './videocall.service';
// import { Public } from 'src/auth/guard/public.decorator';
// import { Public } from 'src/auth/guard/public.decorator';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ApiBody, ApiConsumes } from '@nestjs/swagger';
// import { ImageValidationPipe } from 'src/common/utils/image-validation.pipe';

@Controller('suppoter-dashboard')
export class SuppoterDashboardController {
  constructor(
    private readonly referralService: ReferralService,
    private readonly videoCallChatService: VideoCallChatService,
  ) {}

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

  // Overview stats (earning, supporters, membership, services)
  @Roles(Role.Supporter)
  @Get('overview')
  async getOverview(@Req() req: Request) {
    const userId = req['sub'] as string; // logged in userId
    return this.referralService.getOverview(userId);
  }

  @Roles(Role.User)
  @Get('membershipVideoCallChatList')
  async getVideoCallChatList(@Req() req: Request) {
    return this.videoCallChatService.getVideoCallChatList(req['sub'] as string);
  }

  @Roles(Role.User)
  @Get('videoCall_scheduls')
  async getVideoCallSchedul(@Req() req: Request) {
    return this.videoCallChatService.getVideoCallSchedul(req['sub'] as string);
  }

  // @Public()
  // @Get('get_all_videoCall_scheduls')
  // async getAllVideoCallSchedul() {
  //   return this.videoCallChatService.getAllVideoCallSchedul();
  // }

  @Roles(Role.User)
  @Get('videoCall_schedul/:id')
  async getVideoCallSingleData(@Param('id') id: string) {
    return this.videoCallChatService.getVideoCallSingleData(id);
  }

  @Roles(Role.User)
  @Get('serviceOrder_videoCall_schedul')
  async getVideoCallSchedulServiceOrder(@Req() req: Request) {
    return this.videoCallChatService.getVideoCallSchedulServiceOrder(
      req['sub'] as string,
    );
  }

  @Roles(Role.User)
  @Get('drinks_cheers_live')
  async drinksCheersLive(@Req() req: Request) {
    return this.videoCallChatService.drinksCheersLive(req['sub'] as string);
  }

  @Roles(Role.User, Role.Supporter)
  @Get('total-purchases')
  async getTotalPurchases(@Req() req: Request) {
    return this.referralService.getTotalPurchases(req['sub'] as string);
  }
}
