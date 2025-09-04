import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { AuthUserService } from './user-auth-info/authUser.service';
import { StripeModule } from 'src/utils/stripe/stripe.module';

@Module({
  imports: [PrismaClientModule, StripeModule],
  controllers: [UserController],
  providers: [UserService, AuthUserService],
  exports: [AuthUserService],
})
export class UserModule {}
