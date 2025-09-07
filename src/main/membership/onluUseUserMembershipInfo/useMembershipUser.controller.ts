import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { MembershipServiceUseToUserOnly } from './useMembershipUser.service';
import { Public } from 'src/auth/guard/public.decorator';
import { Request } from 'express';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { BuyMembershipDto } from './dto/buyMembership.dto';

@Controller('membership_use_user')
export class MembershipUseToUserOnly {
  constructor(
    private readonly membershipServiceUser: MembershipServiceUseToUserOnly,
  ) {}

  //   @Public()
  @Roles(Role.User)
  @Post('buy')
  buyMembership(@Req() req: Request, @Body() data: BuyMembershipDto) {
    console.log(req['sub']);
    console.log(data);
    return this.membershipServiceUser.buyMembership(req['sub'] as string, data);
  }

  @Public()
  @Get('levels/:membershipId')
  getMembership(@Param('membershipId') membershipId: string) {
    return this.membershipServiceUser.getMembershipLevels(membershipId);
  }
}
