import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/main/user/user.module';
import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';
import { StripeModule } from 'src/utils/stripe/stripe.module';
import { MailModule } from 'src/utils/mail/mail.module';

@Module({
  imports: [UserModule, CloudinaryModule, StripeModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
