import { Module } from '@nestjs/common';
import { PayoutService } from './payout.service';
import { PayoutController } from './payout.controller';
import { StripeModule } from 'src/utils/stripe/stripe.module';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';

@Module({
  imports: [StripeModule, PrismaClientModule],
  controllers: [PayoutController],
  providers: [PayoutService],
})
export class PayoutModule {}
