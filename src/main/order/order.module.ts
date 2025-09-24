import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { StripeModule } from 'src/utils/stripe/stripe.module';

@Module({
  imports: [PrismaClientModule, StripeModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
