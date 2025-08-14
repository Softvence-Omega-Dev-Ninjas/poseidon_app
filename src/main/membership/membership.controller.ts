import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { MembershipService } from './membership.service';
// import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Request } from 'express';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { CreateMembershipLevelDto } from './dto/create-membership-level.dto';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Roles(Role.Supporter)
  @Get('enable-membership')
  enableMembership(@Req() req: Request) {
    return this.membershipService.enableMembership(req['sub'] as string);
  }

  @Roles(Role.Supporter)
  @Post('create-levels')
  createMembershipLevel(
    @Body() createMembershipLevelDto: CreateMembershipLevelDto,
  ) {
    return this.membershipService.createMembershipLevel(
      createMembershipLevelDto,
    );
  }
}
