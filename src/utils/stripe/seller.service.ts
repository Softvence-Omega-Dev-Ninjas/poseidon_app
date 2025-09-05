import { HttpException, Inject } from '@nestjs/common';
import { cResponseData } from 'src/common/utils/common-responseData';
import Stripe from 'stripe';

export class SellerService {
  constructor(@Inject('STRIPE_CLIENT') private stripe: Stripe) {}

  // create connected account for seller or supporter
  async createConnectedAccount(email: string, userId: string, name: string) {
    try {
      const account = await this.stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: email,
        metadata: {
          userId: userId,
          name: name,
        },
        capabilities: {
          transfers: { requested: true },
          card_payments: { requested: true },
        },
      });
      return account;
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      throw new HttpException(
        cResponseData({
          message: 'Failed to create Stripe account',
          data: null,
          error: errorMessage,
          success: false,
        }),
        400,
      );
    }
  }

  async createOnboardingAccountLink(accountId: string, redirect_url?: string) {
    try {
      const accountLink = await this.stripe.accountLinks.create({
        account: accountId,
        refresh_url: `${process.env.FRONTEND_URL}/notfound`,
        return_url: redirect_url
          ? `${process.env.FRONTEND_URL}/${redirect_url}`
          : `${process.env.FRONTEND_URL}/signin`,
        type: 'account_onboarding',
      });
      return accountLink;
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      throw new HttpException(
        cResponseData({
          message: 'Failed to create Stripe account link',
          data: null,
          error: errorMessage,
          success: false,
        }),
        400,
      );
    }
  }
}
