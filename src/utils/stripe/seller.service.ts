import { Inject } from '@nestjs/common';
import Stripe from 'stripe';

export class SellerService {
  constructor(@Inject('STRIPE_CLIENT') private stripe: Stripe) {}
}
