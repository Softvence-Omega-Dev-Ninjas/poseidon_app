import { HttpException, Injectable } from '@nestjs/common';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CheckOutService } from 'src/utils/stripe/checkOut.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly checkOutService: CheckOutService,
  ) {}

  async membershipPaymentCheckOut(id: string) {
    const unpaid = await this.prisma.paymentDetails.findFirst({
      where: { id },
      select: {
        buyerId: true,
        sellerId: true,
        amount: true,
        serviceType: true,
        serviceId: true,
        paymemtStatus: true,
        cs_number: true,
      },
    });
    console.log('unpaid Data with payment', unpaid);
    if (!unpaid?.cs_number) throw new HttpException('Payment not found', 404);
    const checkoutSession = await this.checkOutService.checkPayment(
      unpaid.cs_number,
    );
    if (!checkoutSession) throw new HttpException('Payment not found', 404);
    if (checkoutSession.payment_status === 'paid') {
      await this.upDateOne(id, {
        paymemtStatus: 'paid',
      });
    }
    const membershipId = await this.prisma.membership_owner.findFirst({
      where: { ownerId: unpaid.sellerId },
      select: { id: true },
    });
    console.log('membershipId', membershipId);
    return membershipId?.id
      ? `${process.env.FRONTEND_URL}/success` //${process.env.FRONTEND_URL}/membership/${membershipId?.id}
      : `${process.env.FRONTEND_URL}`;
  }

  async upDateOne(id: string, data: UpdatePaymentDto) {
    return await this.prisma.paymentDetails.update({
      where: { id },
      data,
    });
  }
}
