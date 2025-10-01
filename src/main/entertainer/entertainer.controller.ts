import { Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { EntertainerService } from './entertainer.service';
import { handleRequest } from 'src/common/utils/request.handler';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/auth/guard/role.enum';
import { Roles } from 'src/auth/guard/roles.decorator';

@ApiTags('Entertainer')
@Controller('entertainer')
export class EntertainerController {
  constructor(private readonly entertainer: EntertainerService) {}

  // get all entertainer
  @Get()
  @Roles(Role.User, Role.Supporter)
  async getAllEntertainer(@Req() req: Request) {
    const userId = req['sub'] as string;
    return handleRequest(
      () => this.entertainer.getAllEntertainer(userId),
      'Get All Entertainer successfully',
    );
  }
  // get supporter recent post...
  @Get('recent-posts')
  @Roles(Role.User, Role.Supporter)
  async getAllSupportersRecentPosts(@Req() req: Request) {
    const userId = req['sub'] as string;
    return handleRequest(
      () => this.entertainer.getRecentSupporterPosts(userId),
      'Fetched recent post(s) of all supporters',
    );
  }

  // create follower..
  @Post('/follow/:supporterId')
  @Roles(Role.User, Role.Supporter)
  async follow(@Req() req: Request, @Param('supporterId') supporterId: string) {
    const userId = req['sub'] as string;
    return handleRequest(
      () => this.entertainer.followSuporter(userId, supporterId),
      'You follow supporter successfully',
    );
  }

  // create follower..
  @Delete('/unfollow/:supporterId')
  @Roles(Role.User, Role.Supporter)
  async unfollow(
    @Req() req: Request,
    @Param('supporterId') supporterId: string,
  ) {
    const userId = req['sub'] as string;
    return handleRequest(
      () => this.entertainer.unfollowSuporter(userId, supporterId),
      'You unfollow supporter successfully',
    );
  }
  // get my following id....
  @Get('/following')
  @Roles(Role.User, Role.Supporter)
  async getFollowing(@Req() req: Request) {
    const userId = req['sub'] as string;
    return handleRequest(
      () => this.entertainer.getFollowingList(userId),
      'Following list fetched successfully',
    );
  }
}
