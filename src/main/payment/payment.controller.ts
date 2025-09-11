import { Controller, Get, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Public } from 'src/auth/guard/public.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Public()
  @Get('success/:params')
  Success(@Param('params') params: string) {
    const [type, id] = params.split('/');
    console.log({ params });
    return { params, type, id };
    // return this.paymentService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }
}
