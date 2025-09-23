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
          name: user.createProfileDto.name,
        },
        capabilities: {
          transfers: { requested: true },
          crypto_payments: { requested: true },
        },
        business_profile: {
          mcc: '8999',
          url: `drinkwithme.click/${user.url}`,
        },
        individual: {
          first_name: user.createProfileDto.name,
          last_name: user.createProfileDto.username,
          address: {
            line1: user.createProfileDto.address,
            state: user.createProfileDto.state,
            city: user.createProfileDto.city,
            postal_code: user.createProfileDto.postcode,
            country: user.createProfileDto.country,
          },
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
          : `${process.env.FRONTEND_URL}/login`,
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

  async financialServices(accountId: string) {
    try {
      const balance = await this.stripe.balance.retrieve({
        stripeAccount: accountId,
      });

      function formatAmount(amount: number, currency: string) {
        // Convert cents to dollars
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
        }).format(amount / 100);
      }

      const available = balance.available.reduce(
        (sum, b) => (b.currency == 'usd' ? sum + b.amount : 0),
        0,
      );
      const pending = balance.pending.reduce(
        (sum, b) => (b.currency == 'usd' ? sum + b.amount : 0),
        0,
      );
      const total = available + pending;

      const cCurrency = ['usdc', 'usdp', 'usdg'];

      const cryptoAvailable = balance.available.reduce(
        (sum, b) => (cCurrency.includes(b.currency) ? sum + b.amount : 0),
        0,
      );
      const cryptoPending = balance.pending.reduce(
        (sum, b) => (cCurrency.includes(b.currency) ? sum + b.amount : 0),
        0,
      );
      const cryptoTotal = cryptoAvailable + cryptoPending;

      const payouts = await this.stripe.payouts.list(
        {
          limit: 10,
        },
        {
          stripeAccount: accountId,
        },
      );

      return {
        // Withdraw: formatAmount(available, 'usd'),
        Available_for_Payout: formatAmount(pending, 'usd'),
        Total_Earning: formatAmount(total, 'usd'),
        Crypto_balance: formatAmount(cryptoPending, 'usd'),
        payouts: payouts,
        rowData: balance,
      };
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      throw new HttpException(
        cResponseData({
          message: 'Failed to retrieve financial services',
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
