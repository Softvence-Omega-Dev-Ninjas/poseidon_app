import { Controller, Get, Param, Req } from '@nestjs/common';
import { SupporterProfileService } from './supporter-profile.service';
// import { CreateSupporterProfileDto } from './dto/create-supporter-profile.dto';
// import { UpdateSupporterProfileDto } from './dto/update-supporter-profile.dto';
import { Public } from 'src/auth/guard/public.decorator';
import { Request } from 'express';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { GetShopDataService } from './getShopData.service';
import { GetPostDataService } from './getPostData.service';
import { resData } from 'src/common/utils/sup-profile.resData';
// import { ProductService } from '../product/product.service';

@Public()
@Controller('supporter-profile')
export class SupporterProfileController {
  constructor(
    private readonly supporterProfileService: SupporterProfileService,
    private readonly getShopDataService: GetShopDataService,
    private readonly getPostDataService: GetPostDataService,
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
    return resData({ data: hPageData, editing: profile_id == res['sub'] });
  }

  // shop data
  @Public()
  @Roles(Role.User, Role.Supporter)
  @Get('shop/:shop_id')
  shop(@Param('shop_id') shop_id: string) {
    return this.getShopDataService.getAllShopData(shop_id);
  }

  @Get('shop/products-details/:id')
  productsDetails(@Param('id') id: string) {
    return this.getShopDataService.getFindOne(id);
  }

  // post data
  @Public()
  @Roles(Role.User, Role.Supporter)
  @Get('posts/:userid')
  getAllPost(@Param('userid') user_id: string) {
    return this.getPostDataService.getAllPost(user_id);
  }
}
