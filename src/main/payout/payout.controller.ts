import { Controller, Get, Req } from '@nestjs/common';
import { PayoutService } from './payout.service';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { Request } from 'express';

@Controller('payout')
export class PayoutController {
  constructor(private readonly payoutService: PayoutService) {}

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
  @Get('sellerAccountSetupClientSecret-2')
  async sellerAccountSetupClientSecret_2(@Req() req: Request) {
    console.log(
      "console.log('sellerAccountSetupClientSecret', clientSecret); ",
      req['stripeAccountId'],
    );
    return this.payoutService.sellerAccountSetupClientSecret_2(
      req['sub'] as string,
    );
  }
}
