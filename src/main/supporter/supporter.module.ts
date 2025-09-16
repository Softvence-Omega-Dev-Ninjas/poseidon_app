import { Module } from '@nestjs/common';
import { SupporterService } from './supporter.service';
import { SupporterController } from './supporter.controller';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { StripeModule } from 'src/utils/stripe/stripe.module';

@Module({
  imports: [PrismaClientModule, StripeModule],
  controllers: [SupporterController],
  providers: [SupporterService],
})
export class SupporterModule {}
