import { Controller, Post, Body } from '@nestjs/common';
import { MembershipRewardService } from './reward.service';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
// import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateVideoCallRewardDto } from './dto/create-video-call-reward.dto';

@Controller('membership-levels-reward')
export class MembershipRewardController {
  constructor(
    private readonly membershipRewardService: MembershipRewardService,
  ) {}

  @Roles(Role.Supporter)
  @Post('video_call')
  createVideoCallReward(
    @Body() createVideoCallRewardDto: CreateVideoCallRewardDto,
  ) {
    return this.membershipRewardService.createVideoCallReward(
      createVideoCallRewardDto,
    );
  }
}
