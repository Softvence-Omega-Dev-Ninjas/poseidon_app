import { Controller, Post, Body } from '@nestjs/common';
import { MembershipRewardService } from './reward.service';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import {
  CreateVideoCallRewardDto,
  CreateMembershipAccessToMessagesDto,
  CreateMembershipAccessToGalleryDto,
  CreateMembershipAccessToPostsDto,
} from './dto/create-all-reward.dto';

@Controller('membership-levels-reward')
export class MembershipRewardController {
  constructor(
    private readonly membershipRewardService: MembershipRewardService,
  ) {}

  @Roles(Role.Supporter)
  @Post('video_call')
  async createVideoCallReward(
    @Body() createVideoCallRewardDto: CreateVideoCallRewardDto,
  ) {
    return this.membershipRewardService.createVideoCallReward(
      createVideoCallRewardDto,
    );
  }

  @Roles(Role.Supporter)
  @Post('messages')
  async createMessagesAccessReward(
    @Body() createMessagesAccessDto: CreateMembershipAccessToMessagesDto,
  ) {
    return this.membershipRewardService.createMessagesAccessReward(
      createMessagesAccessDto,
    );
  }

  @Roles(Role.Supporter)
  @Post('gallery')
  async createGalleryAccessReward(
    @Body() createGalleryAccessDto: CreateMembershipAccessToGalleryDto,
  ) {
    return this.membershipRewardService.createGalleryAccessReward(
      createGalleryAccessDto,
    );
  }

  @Roles(Role.Supporter)
  @Post('posts')
  async createPostsAccessReward(
    @Body() createPostsAccessDto: CreateMembershipAccessToPostsDto,
  ) {
    return this.membershipRewardService.createPostsAccessReward(
      createPostsAccessDto,
    );
  }
}
