import { HttpException, Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CheckOutPaymentSessionsDto } from './dto/checkOutPaymentSessionsDto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { cResponseData } from 'src/common/utils/common-responseData';

@Injectable()
export class StripeService {
  constructor(
    @Inject('STRIPE_CLIENT') private stripe: Stripe,
    private readonly prisma: PrismaService,
  ) {}

  async checkOutPaymentSessionsMembership(data: CheckOutPaymentSessionsDto) {
    const seller = await this.prisma.user.findFirst({
      where: { id: data.sellerId, role: 'supporter' },
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

    const fee = Math.floor(data.amount * 0.2); // 20% platform fee

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card', 'us_bank_account', 'crypto'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'test',
            },
            unit_amount: data.amount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        paymentDetails: data.payment_info_id,
        buyerId: data.buyerId,
        sellerId: data.sellerId,
        productName: data.serviceName,
        amount: data.amount,
        serviceType: data.serviceType, // example membership or support
        serviceId: data.serviceId, // example membershipId or supportId
      },
      payment_intent_data: {
        application_fee_amount: fee * 100,
        transfer_data: { destination: seller.stripeAccountId },
      },
      success_url: `${process.env.BACKEND_URL}/payment/success/membership/${data.payment_info_id}`,
      cancel_url: `${process.env.BACKEND_URL}/payment/cancel`,
    });

    if (!session.id) {
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
        cs_number: session.id,
        paymemtStatus: session.payment_status,
        endDate,
      },
    });

    return session;
  }
}
