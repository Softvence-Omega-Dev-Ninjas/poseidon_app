import { Controller, Get, Param, Req } from '@nestjs/common';
import { SupporterProfileService } from './supporter-profile.service';
// import { CreateSupporterProfileDto } from './dto/create-supporter-profile.dto';
// import { UpdateSupporterProfileDto } from './dto/update-supporter-profile.dto';
import { Public } from 'src/auth/guard/public.decorator';
import { Request } from 'express';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';

@Public()
@Controller('supporter-profile')
export class SupporterProfileController {
  constructor(
    private readonly supporterProfileService: SupporterProfileService,
  ) {}

  @Public()
  @Roles(Role.Supporter)
  @Get(':profile_id')
  async getSupportCart(
    @Param('profile_id') profile_id: string,
    @Req() res: Request,
  ) {
    console.log(
      profile_id,
      '===',
      res['sub'],
      '>>>>',
      profile_id == res['sub'],
    );
    const hPageData =
      await this.supporterProfileService.profilePage(profile_id);
    return {
      message: 'successfull',
      error: null,
      data: hPageData,
      success: true,
      editing: profile_id == res['sub'],
    };
  }
}
