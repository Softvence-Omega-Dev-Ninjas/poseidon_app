import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import { CreateMembershipLevelDto } from './dto/create-membership-level.dto';
import { MembershipSubscriptionPlanPipe } from './pipeline/membershipSubscriptionPlan.pipe';
import { MembershipSubscriptionPlan } from './dto/MembershipSubscriptionPlan.dto';
import {
  LevelImageUpdateDto,
  UpdateMembershipLevelDto,
} from './dto/update-membership-level.dto';
import { StringToBooleanPipe } from 'src/common/utils/stringToBoolean.pipe';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  // supporter Apis
  @Roles(Role.Supporter)
  @Get('enable-membership')
  enableMembership(@Req() req: Request) {
    // console.log("req['memberships_owner_id']", req['memberships_owner_id']);
    return this.membershipService.enableMembership(
      req['memberships_owner_id'] as string,
    );
  }

  // createMembershipLevel
  @Roles(Role.Supporter)
  @Post('create-levels')
  @UseInterceptors(FileInterceptor('levelImage'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateMembershipLevelDto })
  createMembershipLevel(
    @Req() req: Request,
    @Body('MembershipSubscriptionPlan', MembershipSubscriptionPlanPipe)
    membershipSubscriptionPlan: MembershipSubscriptionPlan[],
    @Body('isPublic', StringToBooleanPipe) isPublic: boolean,
    @Body() createMembershipLevelDto: CreateMembershipLevelDto,
    @UploadedFile(new ImageValidationPipe())
    levelImage: Express.Multer.File,
  ) {
    return this.membershipService.createMembershipLevel(
      req['memberships_owner_id'] as string,
      {
        ...createMembershipLevelDto,
        isPublic,
        levelImage,
        MembershipSubscriptionPlan: membershipSubscriptionPlan,
      },
    );
  }

  // upadte Membership Level
  @Roles(Role.Supporter)
  @Patch('update-levels')
  updateMembershipLevel(
    @Body() updateMembershipLevelDto: UpdateMembershipLevelDto,
  ) {
    return this.membershipService.updateMembershipLevel(
      updateMembershipLevelDto,
    );
  }

  @Roles(Role.Supporter)
  @Delete('delete-levels/:levelId')
  deleteMembershipLevel(@Param('levelId') levelId: string) {
    return this.membershipService.deleteMembershipLevel(levelId);
  }

  @Roles(Role.Supporter)
  @Patch('update-image/:levelId')
  @ApiBody({ type: LevelImageUpdateDto })
  updateMembershipImage(
    @Param('levelId') levelId: string,
    @Body() updateLevelImageDto: LevelImageUpdateDto,
  ) {
    // return updateLevelImageDto;
    return this.membershipService.levelImageUpdate(
      levelId,
      updateLevelImageDto,
    );
  }

  @Roles(Role.Supporter)
  // @Public()
  @Get('get-levels')
  getMembershipLevels(
    // @Param('membershipId') membershipId: string,
    @Req() req: Request,
  ) {
    return this.membershipService.getMembershipLevelsUseForbergirl(
      req['memberships_owner_id'] as string,
    );
  }

  @Roles(Role.Supporter)
  @Get('get-levels/:levelId')
  getMembershipLevel(@Param('levelId') levelId: string) {
    return this.membershipService.getMembershipLevel(levelId);
  }

  @Roles(Role.Supporter)
  @Get('get-top3-card')
  getTop3Card(@Req() req: Request) {
    return this.membershipService.getTop3Card(req['sub'] as string);
  }

  @Roles(Role.Supporter)
  @Get('yearlyEarningChart')
  yearlyEarningChart(@Req() req: Request) {
    return this.membershipService.yearlyEarningChart(req['sub'] as string);
  }
}
