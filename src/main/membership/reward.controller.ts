import { Controller, Post } from '@nestjs/common';
import { MembershipRewardService } from './reward.service';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';

@Controller('membership-levels-reward')
export class MembershipRewardController {
  constructor(
    private readonly membershipRewardService: MembershipRewardService,
  ) {}

  @Roles(Role.Supporter)
  @Post('video_call')
  createVideoCallReward() {
    return 'This action creates a new video call reward';
  }
}
