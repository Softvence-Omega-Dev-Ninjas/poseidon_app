import { Controller, Get, Param, Req } from '@nestjs/common';
import { SupporterProfileService } from './supporter-profile.service';
// import { CreateSupporterProfileDto } from './dto/create-supporter-profile.dto';
// import { UpdateSupporterProfileDto } from './dto/update-supporter-profile.dto';
import { Public } from 'src/auth/guard/public.decorator';
import { Request } from 'express';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { GetShopDataService } from '../product/supporter-profile-pass-data/getShopData.service';

@Public()
@Controller('supporter-profile')
export class SupporterProfileController {
  constructor(
    private readonly supporterProfileService: SupporterProfileService,
    private readonly getShopDataService: GetShopDataService,
  ) {}

  @Public()
  @Roles(Role.User, Role.Supporter)
  @Get(':profile_id')
  async getSupportCart(
    @Param('profile_id') profile_id: string,
    @Req() res: Request,
  ) {
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

  @Public()
  @Roles(Role.User, Role.Supporter)
  @Get('shop/:shop_id')
  shop(@Param('shop_id') shop_id: string) {
    return this.getShopDataService.getAllShopData(shop_id);
  }
}
