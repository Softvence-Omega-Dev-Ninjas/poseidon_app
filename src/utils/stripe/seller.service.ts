import { HttpException, Inject } from '@nestjs/common';
import { cResponseData } from 'src/common/utils/common-responseData';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import Stripe from 'stripe';

interface UserAccountResponse {
  id: string;
  email: string;
  stripeAccountId: string;
  profile: { name: string };
}

export class SellerService {
  constructor(
    @Inject('STRIPE_CLIENT') private stripe: Stripe,
    private readonly prisma: PrismaService,
  ) {}

  async createConnectedAccount(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          stripeAccountId: true,
          profile: { select: { name: true } },
        },
      });
      if (!user || !user.email || !user.profile)
        throw new HttpException(
          cResponseData({
            message: 'User not found',
            data: null,
            error: null,
            success: false,
          }),
          404,
        );
      if (user.stripeAccountId)
        throw new HttpException(
          cResponseData({
            message: 'Stripe account already exists',
            data: { email: user.email },
            error: null,
            success: false,
          }),
          400,
        );

      //   const account = await this.stripe.accounts.create({
      //     type: 'express',
      //     country: 'US',
      //     email: user.email,
      //     metadata: { userId: user.id, name: user.profile?.name ?? '' },
      //     capabilities: {
      //       transfers: { requested: true },
      //       card_payments: { requested: true },
      //       // crypto_transfers: { requested: true },
      //     },
      //   });

      //   console.log('createConnectedAccount', account);

      //   // Save Stripe account ID in user
      //   await this.prisma.user.update({
      //     where: { id: userId },
      //     data: { stripeAccountId: account.id },
      //   });

      //   return account;
    } catch (e) {
      console.log('error', e);
      throw new HttpException(e, e?.statusCode || 500);
    }
  }
}
