import { HttpException, Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ShopPaymentDto } from './dto/shopPayment.dto';
import { converAmountStripe } from 'src/common/utils/stripeAmountConvert';
import { cResponseData } from 'src/common/utils/common-responseData';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class ShopPaymentService {
  constructor(
    @Inject('STRIPE_CLIENT') private stripe: Stripe,
    private readonly prisma: PrismaService,
  ) {}

  async shopPaymentIntent(data: ShopPaymentDto) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: converAmountStripe(data.amount),
        currency: 'usd',
        // payment_method_types: ['card', 'us_bank_account', 'crypto'],
        automatic_payment_methods: { enabled: true },
        // application_fee_amount: platformFee(20),
        metadata: {
          paymentDetailsId: data.paymentDetailsId,
          shopOrderId: data.shopOrderId,
          productId: data.productId,
          amount: data.amount,
          name: data.name,
        },
        transfer_data: {
          destination: data.stripeAccountId,
        },
      });
      console.log(
        'shop payment paymentIntent ===================== ',
        paymentIntent,
      );

      await this.prisma.paymentDetailsByShop.update({
        where: {
          id: data.paymentDetailsId,
        },
        data: {
          pi_number: paymentIntent.id,
        },
      });

      return paymentIntent;
    } catch (e) {
      console.log('shop payment error ===================== ', e);
      throw new HttpException(
        cResponseData({
          message: 'Payment Method faild',
          error: 'payment error',
          data: null,
          success: false,
        }),
        400,
      );
    }
  }
}
