import { Inject } from '@nestjs/common';
import Stripe from 'stripe';
import { ShopPaymentDto } from './dto/shopPayment.dto';
import { converAmountStripe } from 'src/common/utils/stripeAmountConvert';

export class ShopPaymentService {
  constructor(@Inject('STRIPE_CLIENT') private stripe: Stripe) {}

  async shopPaymentIntent(data: ShopPaymentDto) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: converAmountStripe(data.amount),
      currency: 'usd',
      payment_method_types: ['card', 'crypto'],
      metadata: { ...data },
      transfer_data: {
        destination: data.paymentShopId,
      },
    });

    return paymentIntent;
  }
}
