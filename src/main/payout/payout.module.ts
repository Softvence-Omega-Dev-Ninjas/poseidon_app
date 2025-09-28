import { Module } from '@nestjs/common';
import { PayoutService } from './payout.service';
import { PayoutController } from './payout.controller';
import { StripeModule } from 'src/utils/stripe/stripe.module';

@Module({
  imports: [StripeModule],
  controllers: [PayoutController],
  providers: [PayoutService],
})
export class PayoutModule {}
