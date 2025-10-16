import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Get,
} from '@nestjs/common';
import { SupporterService } from './supporter.service';
import { CreateSupporterPayDto } from './dto/create-supporter.dto';
import { UpdateSupporterLayputDto } from './dto/update-supporter.dto';
import { SupportCartLayoutQuantity } from './dto/supportCartLayoutQuantity.dto';
import { cResponseData } from 'src/common/utils/common-responseData';
import { Request } from 'express';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { CheersLivePackageType } from './dto/create-supporter-layout';
import { StripeService } from 'src/utils/stripe/stripe.service';
import { Public } from 'src/auth/guard/public.decorator';
import { BuyMembershipResponseDto } from '../membership/onluUseUserMembershipInfo/dto/buyMembership.dto';

@Controller('supporter')
export class SupporterController {
  constructor(
    private readonly supporterService: SupporterService,
    private readonly stripe: StripeService,
  ) {}

  @Roles(Role.Supporter)
  @Get('get-cart-layout')
  getSupporterCartLayout(@Req() req: Request) {
    return this.supporterService.getSupporterCartLayout(req['sub'] as string);
  }

  @Roles(Role.Supporter)
  @Patch('update-cart')
  upadteSupporterCardLayout(
    @Body() data: UpdateSupporterLayputDto,
    @Req() req: Request,
  ) {
    return this.supporterService.upadteSupporterCardLayout(
      req['sub'] as string,
      data,
    );
  }

  @Roles(Role.Supporter)
  @Post('CreateCheersLivePackageType/:layoutid')
  createCheersLivePackageType(
    @Param('layoutid') layoutid: string,
    @Body() data: CheersLivePackageType,
  ) {
    return this.supporterService.createCheersLivePackageType(layoutid, data);
  }

  @Roles(Role.Supporter)
  @Patch('UpdateCheersLivePackageType/:id')
  updateCheersLivePackageType(
    @Param('id') id: string,
    @Body() data: CheersLivePackageType,
  ) {
    return this.supporterService.updateCheersLivePackageType(id, data);
  }

  @Roles(Role.Supporter)
  @Delete('deleteCheersLivePackageType/:id')
  deleteCheersLivePackageType(@Param('id') id: string) {
    return this.supporterService.deleteCheersLivePackageType(id);
  }

  @Roles(Role.Supporter)
  @Post('create-suggest-quantity')
  createSuggestUpdateQuantity(@Body() data: SupportCartLayoutQuantity) {
    return this.supporterService.createSuggestQuantity(data);
  }

  @Roles(Role.Supporter)
  @Delete('create-suggest-quantity/:id')
  deleteSuggestQuantity(@Param('id') id: string) {
    const dlt = this.supporterService.deleteSuggestQuantity(id);
    return cResponseData({
      message: 'Delete Success',
      data: dlt,
    });
  }

  @Public()
  @Roles(Role.User, Role.Supporter)
  @Post('payment')
  buySupport(
    @Body() createSupporterDto: CreateSupporterPayDto,
    @Req() req: Request,
  ) {
    // // console.log('order_package_name ===========> ', typeof order_package_name);
    // console.log('login user ===========>>>>>>>>>>>>>>>>>>', req['sub']);
    return this.supporterService.create(
      createSupporterDto,
      req['sub'] as string,
    );
  }

  @Public()
  @Roles(Role.User, Role.Supporter)
  @Post('paymentStutasCheck')
  paymentStutasCheck(@Body() createSupporterDto: BuyMembershipResponseDto) {
    return this.supporterService.paymentStatusCheck(createSupporterDto);
  }

  // @Public()
  // @Post('checkout-acccount-this')
  // async payment(@Body() data: any) {
  //   // console.log(data);
  //   const acc = await this.stripe.supporterCardPaymentIntents();
  //   // console.log(acc.requirements);
  //   return acc;
  // }

  // @Public()
  // @Get('payment-check/:pi')
  // paymentCheck(@Param('pi') pi: string) {
  //   return this.stripe.paymentIntentCheck(pi);
  // }

  @Roles(Role.Supporter)
  @Get('gettop3card')
  get3topCard(@Req() req: Request) {
    return this.supporterService.get3topCard(req['sub'] as string);
  }

  @Roles(Role.Supporter)
  @Get('suporterUserList')
  suporterUserList(@Req() req: Request) {
    return this.supporterService.suporterUserList(req['sub'] as string);
  }
}
