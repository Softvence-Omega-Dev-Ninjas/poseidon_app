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
}
