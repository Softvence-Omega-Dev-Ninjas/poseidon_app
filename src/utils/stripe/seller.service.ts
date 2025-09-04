import { HttpException, Inject } from '@nestjs/common';
import { cResponseData } from 'src/common/utils/common-responseData';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import Stripe from 'stripe';

export class SellerService {
  constructor(
    @Inject('STRIPE_CLIENT') private stripe: Stripe,
    private readonly prisma: PrismaService,
  ) {}

  // create connected account for seller or supporter
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
      const profileName: string = user.profile?.name ?? 'Guest User';
      const account = await this.stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: user.email,
        metadata: {
          userId: user.id,
          name: profileName,
        },
        capabilities: {
          transfers: { requested: true },
          card_payments: { requested: true },
        },
      });

      // Save Stripe account ID in user
      await this.prisma.user.update({
        where: { id: userId },
        data: { stripeAccountId: account.id },
      });

      const accountLink = await this.stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.DOMAIN}/stripe/reauth`,
        return_url: `${process.env.DOMAIN}/login`,
        type: 'account_onboarding',
      });

      return accountLink;
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
}
