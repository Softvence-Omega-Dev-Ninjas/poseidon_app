import { Injectable } from '@nestjs/common';
import { SellerService } from 'src/utils/stripe/seller.service';
import { cResponseData } from 'src/common/utils/common-responseData';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class PayoutService {
  constructor(
    private readonly sellerServiceStripe: SellerService,
    private readonly prisma: PrismaService,
  ) {}

  async balenceSheet(stripeAccountId: string) {
    if (!stripeAccountId) {
      return cResponseData({
        message: 'Stripe account id is required',
        data: null,
        error: null,
        success: false,
      });
    }
    const balanceSheet =
      await this.sellerServiceStripe.financialServices(stripeAccountId);
    // console.log('balanceSheet', balanceSheet);
    return cResponseData({
      message: 'Balance sheet',
      data: balanceSheet,
      error: null,
      success: true,
    });
  }

  async checkoutAccount(userid: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userid,
      },
      select: {
        stripeAccountId: true,
      },
    });
    // console.log(user?.stripeAccountId);
    const financial_account_check: { stripe: boolean } = {
      stripe: false,
    };
    if (!user || !user.stripeAccountId) {
      return cResponseData({
        message: 'Stripe account id is required',
        data: financial_account_check,
        error: null,
        success: false,
      });
    }
    const checkoutAccount =
      await this.sellerServiceStripe.checkAccountsInfoSystem(
        user.stripeAccountId,
      );

    financial_account_check.stripe = checkoutAccount;

    return cResponseData({
      message: 'Checkout account',
      data: financial_account_check,
      error: null,
      success: true,
    });
  }

  async sellerAccountSetupClientSecret(stripeAccountId: string) {
    if (!stripeAccountId) {
      return cResponseData({
        message: 'Stripe account id is required',
        data: null,
        error: null,
        success: false,
      });
    }
    const clientSecret =
      await this.sellerServiceStripe.sellerAccountSetupClientSecret(
        stripeAccountId,
      );

    if (!clientSecret) {
      return cResponseData({
        message: 'Client secret not found',
        data: null,
        error: null,
        success: false,
      });
    }

    // console.log('sellerAccountSetupClientSecret', clientSecret);

    return cResponseData({
      message: 'Client secret',
      data: clientSecret,
      error: null,
      success: true,
    });
  }
  async sellerAccountSetupClientSecret_2({
    userid,
    redirect_url,
  }: {
    userid: string;
    redirect_url: string;
  }) {
    if (!userid) {
      return cResponseData({
        message: 'user not found',
        data: null,
        error: null,
        success: false,
      });
    }
    return await this.sellerServiceStripe.sellerAccountSetupClientSecret2(
      userid,
      redirect_url ? redirect_url : '',
    );
  }
}
