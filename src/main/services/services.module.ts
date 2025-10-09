import { Module } from '@nestjs/common';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';
import { ServiceService } from './services.service';
import { ServiceController } from './services.controller';
import { StripeModule } from 'src/utils/stripe/stripe.module';
import { CalendlyModule } from '../calendly/calendly.module';

@Module({
  imports: [PrismaClientModule, CloudinaryModule, StripeModule, CalendlyModule],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServicesModule {}
