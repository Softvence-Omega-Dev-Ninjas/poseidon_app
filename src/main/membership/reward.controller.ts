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
import {
  UpdateGalleryRewardDto,
  UpdateMessagesRewardDto,
  UpdatePostsRewardDto,
  UpdateVideoCallRewardDto,
} from './dto/update-reward.dto';

@Controller('membership-levels-reward')
export class MembershipRewardController {
  constructor(
    private readonly membershipRewardService: MembershipRewardService,
  ) {}

  // @Roles(Role.Supporter)
  // @Post('createReward')
  // createReward(@Body() createVideoCallRewardDto: WhoCreateReward) {
  //   return this.membershipRewardService.createVideoCallReward(
  //     createVideoCallRewardDto.rewardData,
  //   );
  // }

  // video call apis
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
  @Patch('video_call_update/:id')
  updateVideoCallRewardById(
    @Param('id') id: string,
    @Body() updateVideoCallRewardDto: UpdateVideoCallRewardDto,
  ) {
    return this.membershipRewardService.updateVideoCallReward(
      id,
      updateVideoCallRewardDto,
    );
  }

  // messages api
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
  @Patch('messages_update/:id')
  updateMessagesRewardById(
    @Param('id') id: string,
    @Body() updateMessagesRewardDto: UpdateMessagesRewardDto,
  ) {
    return this.membershipRewardService.updateMessagesReward(
      id,
      updateMessagesRewardDto,
    );
  }

  // gallery api
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
  @Patch('gallery_update/:id')
  updateGalleryRewardById(
    @Param('id') id: string,
    @Body() updateGalleryRewardDto: UpdateGalleryRewardDto,
  ) {
    return this.membershipRewardService.updateGalleryReward(
      id,
      updateGalleryRewardDto,
    );
  }

  // Posts api
  @Roles(Role.Supporter)
  @Post('posts')
  async createPostsAccessReward(
    @Body() createPostsAccessDto: CreateMembershipAccessToPostsDto,
  ) {
    return this.membershipRewardService.createPostsAccessReward(
      createPostsAccessDto,
    );
  }
  @Roles(Role.Supporter)
  @Patch('posts_update/:id')
  updatePostsRewardById(
    @Param('id') id: string,
    @Body() updatePostsRewardDto: UpdatePostsRewardDto,
  ) {
    return this.membershipRewardService.updatePostsReward(
      id,
      updatePostsRewardDto,
    );
  }

  // get All Rewards
  // @Roles(Role.Supporter)
  @Public()
  @Get('all/:membershipLevelId')
  async getAllRewards(@Param('membershipLevelId') membershipLevelId: string) {
    return await this.membershipRewardService.getAllReward(membershipLevelId);
  }

  // @Roles(Role.Supporter)
  @Public()
  @Patch('video_call-update/:id')
  updateVideoCallReward(
    @Param('id') id: string,
    @Body() updateVideoCallRewardDto: UpdateVideoCallRewardDto,
  ) {
    return this.membershipRewardService.updateVideoCallReward(
      id,
      updateVideoCallRewardDto,
    );
  }
}
