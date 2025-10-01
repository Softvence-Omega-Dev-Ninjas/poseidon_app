import { Injectable } from '@nestjs/common';
import { PaymemtStatus, ServiceType } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

// import * as argon2 from 'argon2';

@Injectable()
export class ReferralService {
  constructor(private prisma: PrismaService) {}

  // Referral signups count
  async getSignUps(userId: string) {
    const inviter = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!inviter) throw new Error('User not found');

    const count = await this.prisma.referral.count({
      where: { inviterId: userId },
    });
    return { signUps: count };
  }

  // get earning, supporters, member, service.
  async getOverview(userId: string) {
    // Earnings sum of all paid transactions for this seller
    const earnings = await this.prisma.paymentDetails.aggregate({
      where: { sellerId: userId, paymemtStatus: PaymemtStatus.paid },
      _sum: { amount: true },
    });

    // Supporters unique buyers who paid for support
    const supporters = await this.prisma.paymentDetails.findMany({
      where: { sellerId: userId, paymemtStatus: PaymemtStatus.paid },
      select: { buyerId: true },
    });
    const supporterCount = new Set(supporters.map((s) => s.buyerId)).size;

    // Memberships unique buyers who paid for membership
    const memberships = await this.prisma.paymentDetails.findMany({
      where: {
        sellerId: userId,
        serviceType: ServiceType.membership,
        paymemtStatus: PaymemtStatus.paid,
      },
      select: { buyerId: true },
    });
    const membershipCount = new Set(memberships.map((m) => m.buyerId)).size;

    // Services count how many service purchases completed
    const servicesCount = await this.prisma.serviceOrder.count({
      where: {
        sellerId: userId,
        paymentDetails: { paymemtStatus: PaymemtStatus.paid },
      },
    });

    return {
      earning: earnings._sum.amount || 0,
      supporters: supporterCount,
      membership: membershipCount,
      services: servicesCount,
    };
  }

  //   // update user account
  //  async updateUser(
  //     userId: string,
  //     dto: UpdateAccountDto,
  //     image?: Express.Multer.File,
  //   ) {
  //     const user = await this.prisma.user.findUnique({ where: { id: userId } });
  //     if (!user) {
  //       throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //     }

  async getTotalPurchases(userId: string) {
    const supporterPayPurchases = await this.prisma.supporterPay.count({
      where: {
        user_id: userId,
        paymemtStatus: 'paid',
      },
    });
    const productPurchases = await this.prisma.order.count({
      where: {
        userId,
        paymentDetailsByShop: {
          paymemtStatus: 'paid',
        },
      },
    });

    const servicePurchases = await this.prisma.serviceOrder.count({
      where: {
        userId,
        paymentDetails: {
          paymemtStatus: 'paid',
        },
      },
    });

    const paymentDetails = await this.prisma.paymentDetails.count({
      where: {
        buyerId: userId,
        paymemtStatus: 'paid',
      },
    });

    const totalPurchases =
      supporterPayPurchases +
      productPurchases +
      servicePurchases +
      paymentDetails;
    return { totalPurchases };
  }
}
