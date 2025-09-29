import { Injectable } from '@nestjs/common';
import { SellerService } from 'src/utils/stripe/seller.service';
import { cResponseData } from 'src/common/utils/common-responseData';

@Injectable()
export class PayoutService {
  constructor(private readonly sellerServiceStripe: SellerService) {}

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
    console.log('balanceSheet', balanceSheet);
    return cResponseData({
      message: 'Balance sheet',
      data: balanceSheet,
      error: null,
      success: true,
    });
  }

  async checkoutAccount(stripeAccountId: string) {
    if (!stripeAccountId) {
      return cResponseData({
        message: 'Stripe account id is required',
        data: null,
        error: null,
        success: false,
      });
    }
    const checkoutAccount =
      await this.sellerServiceStripe.checkAccountsInfoSystem(stripeAccountId);

    return cResponseData({
      message: 'Checkout account',
      data: checkoutAccount,
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

    return cResponseData({
      message: 'Client secret',
      data: clientSecret,
      error: null,
      success: true,
    });
  }
}
