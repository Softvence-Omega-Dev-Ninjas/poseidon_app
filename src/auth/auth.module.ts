import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/main/user/user.module';
import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';
import { StripeModule } from 'src/utils/stripe/stripe.module';

@Module({
  imports: [UserModule, CloudinaryModule, StripeModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
