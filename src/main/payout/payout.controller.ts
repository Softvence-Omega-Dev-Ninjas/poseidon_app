import { Controller, Get, Post, Req, Body } from '@nestjs/common';
import { PayoutService } from './payout.service';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { Request } from 'express';
import { RedirectUrlDto, SellerPayoutAmount } from './dto/create-payout.dto';
import { SellerService } from 'src/utils/stripe/seller.service';

@Controller('payout')
export class PayoutController {
  constructor(
    private readonly payoutService: PayoutService,
    private readonly sellerServiceStripe: SellerService,
  ) {}

  @Roles(Role.Supporter)
  @Get('balance-sheet')
  async getBalanceSheet(@Req() req: Request) {
    return this.payoutService.balenceSheet(req['stripeAccountId'] as string);
  }

  @Roles(Role.Supporter)
  @Get('checkoutAccount')
  async checkoutAccount(@Req() req: Request) {
    return this.payoutService.checkoutAccount(req['stripeAccountId'] as string);
  }

  @Roles(Role.Supporter)
  @Get('sellerAccountSetupClientSecret')
  async sellerAccountSetupClientSecret(@Req() req: Request) {
    console.log(
      "console.log('sellerAccountSetupClientSecret', clientSecret); ",
      req['stripeAccountId'],
    );
    return this.payoutService.sellerAccountSetupClientSecret(
      req['stripeAccountId'] as string,
    );
  }

  @Roles(Role.Supporter)
  @Post('sellerAccountSetupClientSecret-2')
  async sellerAccountSetupClientSecret_2(
    @Body() body: RedirectUrlDto,
    @Req() req: Request,
  ) {
    return this.payoutService.sellerAccountSetupClientSecret_2({
      userid: req['sub'] as string,
      redirect_url: body.redirect_url ? body.redirect_url : '',
    });
  }

  @Roles(Role.Supporter)
  @Get('checkVerify-StripeAcount')
  async checkVarifyStripeAcount(@Req() req: Request) {
    console.log(req['sub']);
    return await this.payoutService.checkoutAccount(req['sub'] as string);
  }

  @Roles(Role.Supporter)
  @Post('sellerPayoutSystem')
  async sellerPayoutSystem(
    @Body() body: SellerPayoutAmount,
    @Req() req: Request,
  ) {
    return this.sellerServiceStripe.sellerPayoutSystem(
      req['stripeAccountId'] as string,
      body.amount,
    );
  }
}
