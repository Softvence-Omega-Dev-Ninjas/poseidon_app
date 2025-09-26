import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class CheckOutService {
  constructor(@Inject('STRIPE_CLIENT') private stripe: Stripe) {}

  async checkPayment(csNumber: string) {
    return await this.stripe.checkout.sessions.retrieve(csNumber);
  }
}
