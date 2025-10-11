import { HttpException, Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CheckOutPaymentSessionsDto } from './dto/checkOutPaymentSessionsDto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { cResponseData } from 'src/common/utils/common-responseData';
import {
  converAmountStripe,
  platformFee,
} from 'src/common/utils/stripeAmountConvert';
import { SellerService } from './seller.service';
import { RefferEarningService } from './refferEarning.service';

@Injectable()
export class StripeService {
  constructor(
    @Inject('STRIPE_CLIENT') private stripe: Stripe,
    private readonly prisma: PrismaService,
    private readonly sellerService: SellerService,
    private readonly refferEarningService: RefferEarningService,
  ) {}

  async checkOutPaymentSessionsMembership(data: CheckOutPaymentSessionsDto) {
    const seller = await this.prisma.user.findFirst({
      where: { id: data.sellerId, role: 'supporter' },
      select: {
        id: true,
        stripeAccountId: true,
      },
    });
    if (!seller?.stripeAccountId)
      throw new HttpException(
        cResponseData({
          message:
            'Seller to be Not create a financial account, Type to Another provider service',
          error: 'Seller not found',
          data: null,
          success: false,
        }),
        404,
      );

    const paymentAction = await this.stripe.paymentIntents.create({
      amount: converAmountStripe(data.amount),
      currency: 'usd',
      // payment_method_types: ['card', 'us_bank_account', 'crypto'],
      automatic_payment_methods: { enabled: true },
      application_fee_amount: platformFee(data.amount), //20%
      metadata: {
        paymentDetails: data.payment_info_id,
        buyerId: data.buyerId,
        sellerId: data.sellerId,
        productName: data.serviceName,
        amount: data.amount,
        serviceType: data.serviceType, // example membership or support
        serviceId: data.serviceId, // example membershipId or supportId
      },
      transfer_data: {
        destination: seller.stripeAccountId,
      },
    });

    // if (seller && seller.id && data.amount) {
    //   ///
    //   await this.refferEarningService.refferEarningBySeller(
    //     seller.id,
    //     data.amount,
    //   );
    // }

    if (!paymentAction.id || !paymentAction.client_secret) {
      throw new HttpException(
        cResponseData({
          message: 'Failed to Your Checkout ',
          error: 'Stripe session not created',
          data: null,
          success: false,
        }),
        500,
      );
    }

    let endDate: Date = new Date();
    if (data.planDuration === 'ONE_MONTH') {
      endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (data.planDuration === 'ONE_YEAR') {
      endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    await this.prisma.paymentDetails.update({
      where: { id: data.payment_info_id },
      data: {
        cs_number: paymentAction.id,
        paymemtStatus: 'unpaid',
        endDate,
      },
    });

    return { client_secret: paymentAction.client_secret, id: paymentAction.id };
  }

  // paymentIntents supporter card
  async supporterCardPaymentIntents() {
    return await this.stripe.accounts.retrieve('acct_1SAdi58uRi3mkP2j');
  }

  async paymentIntentCheck(pi: string) {
    return await this.stripe.paymentIntents.retrieve(pi);
  }

  async testPaymentcheckout() {
    return await this.stripe.checkout.sessions.create({
      payment_method_types: ['card', 'us_bank_account', 'crypto'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'test',
            },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
      metadata: {
        paymentDetails: 'payment_info_id',
        buyerId: 'buyerId',
        sellerId: 'sellerId',
        productName: 'productName',
        amount: 1000,
        serviceType: 'serviceType', // example membership or support
        serviceId: 'serviceId', // example membershipId or supportId
      },
      payment_intent_data: {
        application_fee_amount: 200,
        transfer_data: { destination: 'acct_1S5jTh7v1K8YAWAr' },
      },
      success_url: `${process.env.BACKEND_URL}/payment/success?paymemttype:membership/`,
      cancel_url: `${process.env.BACKEND_URL}/payment/cancel`,
    });
  }
}
