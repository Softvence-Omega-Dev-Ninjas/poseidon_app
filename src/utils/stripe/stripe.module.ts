import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { SellerService } from './seller.service';
import { StripeService } from './stripe.service';

@Module({
  imports: [ConfigModule],
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
  ],
  exports: ['STRIPE_CLIENT', SellerService, StripeService],
})
export class StripeModule {}
