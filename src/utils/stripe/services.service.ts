import { HttpException, Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { converAmountStripe } from 'src/common/utils/stripeAmountConvert';
import { cResponseData } from 'src/common/utils/common-responseData';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CreateServiceOrderDto } from './dto/services.dto';

@Injectable()
export class ServicePaymentService {
  constructor(
    @Inject('STRIPE_CLIENT') private stripe: Stripe,
    private readonly prisma: PrismaService,
  ) {}

  async servicePaymentIntent(data: CreateServiceOrderDto) {
    const { paymentDetails, stripeAccountId, ...restData } = data;
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: converAmountStripe(paymentDetails.amount),
        currency: 'usd',
        // payment_method_types: ['card', 'us_bank_account', 'crypto'],
        automatic_payment_methods: { enabled: true },
        // application_fee_amount: platformFee(20),
        metadata: {
          paymentDetailsId: paymentDetails.id,
          serviceOrderId: restData.id,
          serviceId: restData.serviceId,
          sellerId: restData.sellerId,
          amount: paymentDetails.amount,
          name: restData.name ? restData.name : '',
          createdAt: restData.createdAt.toISOString(),
        },
        transfer_data: {
          destination: stripeAccountId,
        },
      });

      if (
        !paymentIntent ||
        !paymentIntent.id ||
        !paymentIntent.metadata ||
        !paymentIntent.metadata.paymentDetailsId
      ) {
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

      await this.prisma.paymentDetailsByServices.update({
        where: {
          id: paymentIntent.metadata.paymentDetailsId,
        },
        data: {
          pi_number: paymentIntent.id,
          paymemtStatus: 'unpaid',
        },
      });

      return {
        client_secret: paymentIntent.client_secret,
        id: paymentIntent.id,
      };
    } catch (e) {
      // console.log('shop payment error ===================== ', e);
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
