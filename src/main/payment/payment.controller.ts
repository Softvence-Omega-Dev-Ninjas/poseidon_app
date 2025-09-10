import { Controller, Get, Query, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Public } from 'src/auth/guard/public.decorator';
import { CheckOutService } from 'src/utils/stripe/checkOut.service';
import { Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly checkOutService: CheckOutService,
  ) {}

  @Public()
  @Get('success')
  async Success(
    @Query('paymentType') paymentType: string,
    @Query('paymentId') paymentId: string,
    @Res() res: Response,
  ) {
    console.log({ paymentType, paymentId });
    // Buy a membership
    if (paymentType === 'membership') {
      const mpco =
        await this.paymentService.membershipPaymentCheckOut(paymentId);
      return res.redirect(mpco);
    }

    return { paymentType, paymentId };
  }

  @Public()
  @Get('cancel')
  findOne() {
    return 'cancel payment';
  }
}
