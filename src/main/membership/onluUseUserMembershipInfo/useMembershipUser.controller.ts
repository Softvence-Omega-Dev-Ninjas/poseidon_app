import { Body, Controller, Get, Param, Post, Req, Query } from '@nestjs/common';
import { MembershipServiceUseToUserOnly } from './useMembershipUser.service';
import { Public } from 'src/auth/guard/public.decorator';
import { Request } from 'express';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import {
  BuyMembershipDto,
  BuyMembershipResponseDto,
} from './dto/buyMembership.dto';
import { StringToBooleanPipe } from 'src/common/utils/stringToBoolean.pipe';

@Controller('membership-use')
export class MembershipUseToUserOnly {
  constructor(
    private readonly membershipServiceUser: MembershipServiceUseToUserOnly,
  ) {}

  @Public()
  @Get('get_all_levels/:membershipId')
  getMembership(@Param('membershipId') membershipId: string) {
    return this.membershipServiceUser.getMembershipLevels(membershipId);
  }

  @Public()
  @Get('get_levels/:id')
  getLevels(@Param('id') id: string) {
    return this.membershipServiceUser.getLevels(id);
  }

  @Roles(Role.User)
  @Post('buy')
  buyMembership(
    @Req() req: Request,
    @Body() data: BuyMembershipDto,
    @Query('buyforce', StringToBooleanPipe) buyforce: boolean,
  ) {
    // buyforce = buyforce === true ? true : false;
    console.log({ buyforce, data });
    return this.membershipServiceUser.buyMembership(
      req['sub'] as string,
      data,
      buyforce,
    );
  }

  @Roles(Role.User, Role.Supporter)
  @Post('payment-Status')
  paymentStatus(@Body() data: BuyMembershipResponseDto) {
    return this.membershipServiceUser.paymentStatus(data);
  }
}
