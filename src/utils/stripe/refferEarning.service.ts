import { Inject, Injectable } from '@nestjs/common';

import Stripe from 'stripe';

import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { platformFee } from 'src/common/utils/stripeAmountConvert';
import { SellerService } from './seller.service';

@Injectable()
export class RefferEarningService {
  constructor(
    @Inject('STRIPE_CLIENT') private stripe: Stripe,
    private readonly prisma: PrismaService,
    private readonly sellerService: SellerService,
  ) {}

  async refferEarningBySeller(sellerId: string, amount: number) {
    const inviterInfo = await this.prisma.referral.findFirst({
      where: {
        invitedId: sellerId,
      },
      select: {
        inviter: {
          select: {
            id: true,
            stripeAccountId: true,
          },
        },
      },
    });
    if (!inviterInfo || !inviterInfo.inviter.stripeAccountId) return;
    const excect = await this.sellerService.checkAccountsInfoSystem(
      inviterInfo.inviter.stripeAccountId,
    );
    if (!excect) return;
    const reffEarn = await this.stripe.transfers.create({
      amount: platformFee(amount, 0.05),
      currency: 'usd',
      destination: inviterInfo.inviter.stripeAccountId,
    });
    console.log('reffEarn >>>>>>>>>>>>>>>=======', reffEarn);
  }
}
