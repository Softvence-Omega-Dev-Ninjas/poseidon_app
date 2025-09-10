import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { StripeModule } from 'src/utils/stripe/stripe.module';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';

@Module({
  imports: [StripeModule, PrismaClientModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
