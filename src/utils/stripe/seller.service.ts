import { HttpException, Inject, Injectable } from '@nestjs/common';
import { cResponseData } from 'src/common/utils/common-responseData';
import Stripe from 'stripe';
import { ExpreeAccountDto } from './dto/createAccout.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { calculateStripeBalances } from 'src/common/utils/stripeAmountCalculation';
// import { calculateStripeBalances } from 'src/common/utils/stripeAmountCalculation';
// import cc from 'country-list';

@Injectable()
export class SellerService {
  constructor(
    @Inject('STRIPE_CLIENT') private stripe: Stripe,
    private readonly prisma: PrismaService,
  ) {}

  // create connected account for seller or supporter
  async createConnectedAccount(user: ExpreeAccountDto) {
    console.log(user.createProfileDto);
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

      const payoutlist = await this.stripe.payouts.list(
        {
          limit: 10,
        },
        {
          stripeAccount: accountId,
        },
      );

      function formatAmount(amount: number, currency: string) {
        // Convert cents to dollars
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
        }).format(amount / 100);
      }

      // cryptoTotal
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

      console.log('cryptoTotal', cryptoTotal);

      //////
      const sumAmounts = (arr: { amount: number }[] = []) =>
        arr.reduce((total, item) => total + item.amount, 0);

      const available = sumAmounts(balance.available);
      const instantAvailable = sumAmounts(balance.instant_available);
      const pending = sumAmounts(balance.pending);

      const refundAvailable = sumAmounts(
        balance.refund_and_dispute_prefunding?.available || [],
      );
      const refundPending = sumAmounts(
        balance.refund_and_dispute_prefunding?.pending || [],
      );

      return {
        // Withdraw: formatAmount(available, 'usd'),
        Available_for_Payout: formatAmount(
          calculateStripeBalances({
            available,
            pending,
            refundAvailable,
            refundPending,
            instantAvailable,
          }).totalAvailableBalance,
          'usd',
        ),
        Total_Earning: formatAmount(
          calculateStripeBalances({
            available,
            pending,
            refundAvailable,
            refundPending,
            instantAvailable,
          }).totalEarningBalance,
          'usd',
        ),
        Crypto_balance: formatAmount(cryptoPending, 'usd'),
        payoutlist,
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

  // use to Auth login user system this function
  async checkAccountsInfoSystem(accountId: string) {
    const account = await this.stripe.accounts.retrieve(accountId);
    console.log('checkAccountsInfoSystem ================== ', account);
    if (
      !account ||
      !account.external_accounts ||
      !account.external_accounts.data ||
      account.external_accounts.data.length < 1 ||
      !account.tos_acceptance ||
      !account.tos_acceptance.date ||
      !account.charges_enabled ||
      !account.payouts_enabled ||
      account.requirements?.currently_due?.length !== 0
    ) {
      return false;
    }
    return true;
  }

  // setup seller account with stripe Use UI api mount
  async sellerAccountSetupClientSecret(accountId: string) {
    const intent = await this.stripe.accountSessions.create({
      account: accountId,
      components: {
        account_onboarding: {
          enabled: true,
        },
      },
    });
    console.log('accountSessions', intent);
    return intent.client_secret;
  }

  // redirect stripe onDeshboard setup page option 2222 client Not be to requere
  async sellerAccountSetupClientSecret2(userid: string, redirect_url?: string) {
    const userInfo = await this.prisma.user.findFirst({
      where: {
        id: userid,
      },
      include: {
        profile: true,
      },
    });

    if (!userInfo) {
      return cResponseData({
        message: 'user not found',
        data: null,
        error: null,
        success: false,
      });
    }
    if (userInfo.stripeAccountId) {
      const check = await this.checkAccountsInfoSystem(
        userInfo.stripeAccountId,
      );
      if (!check) {
        const intent = await this.createOnboardingAccountLink(
          userInfo.stripeAccountId,
          redirect_url,
        );
        return cResponseData({
          message: 'Stripe account created successfully',
          data: intent,
          error: null,
          success: true,
        });
      }
    }

    const createUserData = {
      id: userInfo.id,
      email: userInfo.email,
      url: `viewpage/${userInfo.username}`,
      createProfileDto: {
        name: userInfo.profile?.name ?? '',
        username: userInfo.username,
        address: userInfo.profile?.address ?? '',
        state: userInfo.profile?.state ?? '',
        city: userInfo.profile?.city ?? '',
        country: userInfo.profile?.country ?? '',
        postcode: userInfo.profile?.postcode ?? '',
        description: userInfo.profile?.description ?? '',
      },
    };

    const accountId = await this.createConnectedAccount(createUserData);

    if (!accountId || !accountId.id) {
      return cResponseData({
        message: 'Failed to create Stripe account',
        data: null,
        error: null,
        success: false,
      });
    }
    const user = await this.prisma.user.update({
      where: {
        id: userInfo.id,
      },
      data: {
        stripeAccountId: accountId.id,
      },
    });

    if (!user || !user.stripeAccountId) {
      return cResponseData({
        message: 'Failed to create Stripe account',
        data: null,
        error: null,
        success: false,
      });
    }

    const intent = await this.createOnboardingAccountLink(
      user.stripeAccountId,
      redirect_url,
    );
    return cResponseData({
      message: 'Stripe account created successfully',
      data: intent,
      error: null,
      success: true,
    });
  }

  async sellerPayoutSystem(stripeAccountId: string, amount: number) {
    if (!stripeAccountId)
      return cResponseData({
        message: 'Stripe account Setup',
        data: null,
        error: null,
        success: false,
      });
    const checkAcount = await this.checkAccountsInfoSystem(stripeAccountId);
    if (!checkAcount)
      return cResponseData({
        message: 'Stripe account Setup',
        data: null,
        error: null,
        success: false,
      });

    const balance = await this.stripe.balance.retrieve({
      stripeAccount: stripeAccountId,
    });

    const sumAmounts = (arr: { amount: number }[] = []) =>
      arr.reduce((total, item) => total + item.amount, 0);

    const available = sumAmounts(balance.available);
    const instantAvailable = sumAmounts(balance.instant_available);
    const pending = sumAmounts(balance.pending);

    const refundAvailable = sumAmounts(
      balance.refund_and_dispute_prefunding?.available || [],
    );
    const refundPending = sumAmounts(
      balance.refund_and_dispute_prefunding?.pending || [],
    );

    const availableBalance = calculateStripeBalances({
      available,
      pending,
      refundAvailable,
      refundPending,
      instantAvailable,
    }).totalAvailableBalance;

    function formatAmount(amount: number, currency: string) {
      // Convert cents to dollars
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
      }).format(amount / 100);
    }

    if (availableBalance / 100 < amount) {
      return cResponseData({
        message: 'Your Balance Is Low',
        data: {
          balance: formatAmount(availableBalance, 'usd'),
        },
        error: null,
        success: false,
      });
    }

    // const payOut = await this.stripe.payouts.retrieve(stripeAccountId);
    const payOut = await this.stripe.payouts.create(
      {
        amount: amount * 100,
        currency: 'usd',
        destination: stripeAccountId,
      },
      {
        stripeAccount: stripeAccountId,
      },
    );

    return cResponseData({
      message: 'Your Payout successfuly tranfrom',
      data: payOut,
      error: null,
      success: false,
    });
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
