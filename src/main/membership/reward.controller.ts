import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { MembershipRewardService } from './reward.service';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import {
  CreateVideoCallRewardDto,
  CreateMembershipAccessToMessagesDto,
  CreateMembershipAccessToGalleryDto,
  CreateMembershipAccessToPostsDto,
} from './dto/create-all-reward.dto';
import { Public } from 'src/auth/guard/public.decorator';

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
  @Patch('video_call/:id')
  updateVideoCallReward(
    @Param('id') id: string,
    @Body() updateVideoCallRewardDto: CreateVideoCallRewardDto,
  ) {
    // return this.membershipRewardService.updateVideoCallReward(
    //   id,
    //   updateVideoCallRewardDto,
    // );
    return 'yes';
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

  // get All Rewards
  // @Roles(Role.Supporter)
  @Public()
  @Get('all/:membershipLevelId')
  async getAllRewards(@Param('membershipLevelId') membershipLevelId: string) {
    return await this.membershipRewardService.getAllReward(membershipLevelId);
  }
}
