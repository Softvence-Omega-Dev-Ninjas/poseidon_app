import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { SellerService } from './seller.service';
import { StripeService } from './stripe.service';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { CheckOutService } from './checkOut.service';
import { ShopPaymentService } from './shopPayment.service';
import { SupporterCardPaymentService } from './supporterCard.service';
import { ServicePaymentService } from './services.service';
import { RefferEarningService } from './refferEarning.service';

@Module({
  imports: [ConfigModule, PrismaClientModule],
  providers: [
    {
      provide: 'STRIPE_CLIENT',
      useFactory: (configService: ConfigService) => {
        const stripeSecretKey: string | undefined =
          configService.get<string>('STRIPE_SECRET_KEY') ||
          process.env.STRIPE_SECRET_KEY;
        return new Stripe(stripeSecretKey || '');
      },
      inject: [ConfigService],
    },
    SellerService,
    StripeService,
    CheckOutService,
    ShopPaymentService,
    SupporterCardPaymentService,
    ServicePaymentService,
    RefferEarningService,
  ],
  exports: [
    'STRIPE_CLIENT',
    SellerService,
    StripeService,
    CheckOutService,
    ShopPaymentService,
    SupporterCardPaymentService,
    ServicePaymentService,
    RefferEarningService,
  ],
})
export class StripeModule {}
