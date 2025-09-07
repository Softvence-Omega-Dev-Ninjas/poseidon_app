import { Controller, Get, Param } from '@nestjs/common';
import { MembershipServiceUseToUserOnly } from './useMembershipUser.service';
import { Public } from 'src/auth/guard/public.decorator';

@Controller('use_membership')
export class MembershipUseToUserOnly {
  constructor(
    private readonly membershipServiceUser: MembershipServiceUseToUserOnly,
  ) {}

  @Public()
  @Get('levels/:membershipId')
  getMembership(@Param('membershipId') membershipId: string) {
    return this.membershipServiceUser.getMembershipLevels(membershipId);
  }
}
