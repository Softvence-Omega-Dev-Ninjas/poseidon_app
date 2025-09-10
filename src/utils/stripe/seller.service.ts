import { HttpException, Inject } from '@nestjs/common';
import { cResponseData } from 'src/common/utils/common-responseData';
import Stripe from 'stripe';
import { ExpreeAccountDto } from './dto/createAccout.dto';

export class SellerService {
  constructor(@Inject('STRIPE_CLIENT') private stripe: Stripe) {}

  // create connected account for seller or supporter
  async createConnectedAccount(user: ExpreeAccountDto) {
    try {
      const account = await this.stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: user.email,
        business_type: 'individual',
        metadata: {
          userId: user.id,
          email: user.email,
          name: user.CreateProfileDto.name,
        },
        capabilities: {
          transfers: { requested: true },
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

  async deleteAccount(accountId: string) {
    try {
      const deleted = await this.stripe.accounts.del(accountId);
      return deleted;
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      throw new HttpException(
        cResponseData({
          message: 'Failed to delete Stripe account',
          data: null,
          error: errorMessage,
          success: false,
        }),
        400,
      );
    }
  }
}
