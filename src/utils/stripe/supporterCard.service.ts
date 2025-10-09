import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CreatePaymentDetailsDto } from './dto/supporterCardPayment.dto';
import { converAmountStripe } from 'src/common/utils/stripeAmountConvert';

@Injectable()
export class SupporterCardPaymentService {
  constructor(@Inject('STRIPE_CLIENT') private stripe: Stripe) {}

  async supportPayemnt(data: CreatePaymentDetailsDto) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: converAmountStripe(data.total_price),
      currency: 'usd',
      //   payment_method_types: ['card', 'us_bank_account', 'crypto'],
      automatic_payment_methods: { enabled: true },
      // application_fee_amount: platformFee(20),
      metadata: { supporterPayTb: data.id, ...data },
      transfer_data: {
        destination: data.stripeAccountId,
      },
    });

    // console.log('supporter paymentIntent', paymentIntent);

    return { client_secret: paymentIntent.client_secret, id: paymentIntent.id };
  }
}
