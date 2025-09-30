import { Injectable } from '@nestjs/common';
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
    console.log(count);

    return { signUps: count };
  }

  async getTotalPurchases(userId: string) {
    const supporterPayPurchases = await this.prisma.supporterPay.count({
      where: {
        user_id: userId,
        paymemtStatus: 'paid',
      },
    }) 
    const productPurchases = await this.prisma.order.count({
      where:{
        userId,
        paymentDetailsByShop:{
          paymemtStatus:'paid'
        }
      }
    })

    const servicePurchases = await this.prisma.serviceOrder.count({
      where:{
        userId,
        paymentDetails:{
          paymemtStatus:'paid'
        }
      }
    })
    
    const paymentDetails = await this.prisma.paymentDetails.count({
      where:{
        buyerId:userId,
        paymemtStatus:'paid'
      }
    })

    const totalPurchases = supporterPayPurchases + productPurchases + servicePurchases + paymentDetails
    return {totalPurchases}
}
}