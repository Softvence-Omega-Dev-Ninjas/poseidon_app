import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
// import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Request } from 'express';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ImageValidationPipe } from 'src/common/utils/image-validation.pipe';
import { Public } from 'src/auth/guard/public.decorator';
import { CreateMembershipLevelDto } from './dto/create-membership-level.dto';
import { MembershipSubscriptionPlanPipe } from './pipeline/membershipSubscriptionPlan.pipe';
import { MembershipSubscriptionPlan } from './dto/MembershipSubscriptionPlan.dto';

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
  @UseInterceptors(FileInterceptor('levelImage'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateMembershipLevelDto })
  createMembershipLevel(
    @Body('MembershipSubscriptionPlan', MembershipSubscriptionPlanPipe)
    membershipSubscriptionPlan: MembershipSubscriptionPlan[],
    @Body() createMembershipLevelDto: CreateMembershipLevelDto,
    @UploadedFile(new ImageValidationPipe())
    levelImage: Express.Multer.File,
  ) {
    // return JSON.stringify(ghdf);
    return this.membershipService.createMembershipLevel({
      ...createMembershipLevelDto,
      levelImage,
      MembershipSubscriptionPlan: membershipSubscriptionPlan,
    });
  }

  // @Roles(Role.Supporter)
  @Public()
  @Get('get-levels/:membershipId')
  getMembershipLevels(@Param('membershipId') membershipId: string) {
    return this.membershipService.getMembershipLevels(membershipId);
  }
}
