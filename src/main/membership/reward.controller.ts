import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { MembershipRewardService } from './reward.service';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import {
  CreateVideoCallRewardDto,
  CreateMembershipAccessToMessagesDto,
  CreateMembershipAccessToGalleryDto,
  CreateMembershipAccessToPostsDto,
  CreateAllRewardsDto,
} from './dto/create-all-reward.dto';
import {
  UpdateGalleryRewardDto,
  UpdateMessagesRewardDto,
  UpdatePostsRewardDto,
  UpdateVideoCallRewardDto,
} from './dto/update-reward.dto';
import { cResponseData } from 'src/common/utils/common-responseData';
import { Request } from 'express';

@Controller('membership-levels-reward')
export class MembershipRewardController {
  constructor(
    private readonly membershipRewardService: MembershipRewardService,
  ) {}

  // create a reward with all tb
  @Roles(Role.Supporter)
  @Post('createReward')
  async createReward(
    @Body() createAllRewardsDto: CreateAllRewardsDto,
    @Req() req: Request,
  ) {
    const objKeys = Object.keys(createAllRewardsDto);

    if (objKeys.includes('videoCallReward'))
      return await this.membershipRewardService.createVideoCallReward(
        req['memberships_owner_id'] as string,
        createAllRewardsDto.videoCallReward as CreateVideoCallRewardDto,
      );
    if (objKeys.includes('messagesReward'))
      return await this.membershipRewardService.createMessagesAccessReward(
        req['memberships_owner_id'] as string,
        createAllRewardsDto.messagesReward as CreateMembershipAccessToMessagesDto,
      );
    if (objKeys.includes('galleryReward'))
      return await this.membershipRewardService.createGalleryAccessReward(
        req['memberships_owner_id'] as string,
        createAllRewardsDto.galleryReward as CreateMembershipAccessToGalleryDto,
      );
    if (objKeys.includes('postsReward'))
      return await this.membershipRewardService.createPostsAccessReward(
        req['memberships_owner_id'] as string,
        createAllRewardsDto.postsReward as CreateMembershipAccessToPostsDto,
      );
    else
      return cResponseData({
        message: 'Invalid type Url',
        data: null,
      });
  }

  // get All Rewards
  @Roles(Role.Supporter)
  @Get('get-all')
  async getAllRewards(@Req() req: Request) {
    return await this.membershipRewardService.getAllReward(
      req['memberships_owner_id'] as string,
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

  // delete Reward Apis
  @Roles(Role.Supporter)
  @Delete('delete')
  async deleteReward(@Query('type') type: string, @Query('id') id: string) {
    // const [type, id] = params.split('/');
    if (type == 'videoCallReward') {
      console.log({ type, id });
      // return 'videoCallReward';
      return await this.membershipRewardService.deleteVideoCallReward(id);
    }
    if (type == 'messagesReward') {
      console.log({ type, id });
      // return 'messagesReward';
      return await this.membershipRewardService.deleteMessagesAccessReward(id);
    }
    if (type == 'galleryReward') {
      console.log({ type, id });
      // return 'galleryReward';
      return await this.membershipRewardService.deleteGalleryAccessReward(id);
    }
    if (type == 'postsReward') {
      console.log({ type, id });
      // return 'postsReward';
      return await this.membershipRewardService.deletePostsAccessReward(id);
    }
    console.log({ type, id });
    return cResponseData({
      message: 'Invalid type Url',
      data: null,
    });
  }
}
