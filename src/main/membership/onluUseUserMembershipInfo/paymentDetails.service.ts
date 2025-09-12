import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class PaymentInfoService {
  constructor(private readonly prisma: PrismaService) {}

  async existingBuyMembership(data: {
    userId: string;
    sellerId: string;
    serviceId: string;
  }) {
    const { userId, sellerId, serviceId } = data;
    const existingPaymentInfo = await this.prisma.paymentDetails.findFirst({
      where: {
        buyerId: userId,
        sellerId: sellerId,
        serviceId: serviceId,
        serviceType: 'membership',
        paymemtStatus: 'paid',
        endDate: {
          gte: new Date(),
        },
      },
    });
    console.log('existingPaymentInfo', existingPaymentInfo);
    return existingPaymentInfo;
  }
}
