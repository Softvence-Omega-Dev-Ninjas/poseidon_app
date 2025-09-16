import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { MembershipRewardService } from './reward.service';
import { MembershipRewardController } from './reward.controller';
import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';
import { MembershipServiceUseToUserOnly } from './onluUseUserMembershipInfo/useMembershipUser.service';
import { MembershipUseToUserOnly } from './onluUseUserMembershipInfo/useMembershipUser.controller';
import { StripeModule } from 'src/utils/stripe/stripe.module';
import { PaymentInfoService } from './onluUseUserMembershipInfo/paymentDetails.service';
import { MediafileModule } from '../mediafile/mediafile.module';

@Module({
  imports: [
    PrismaClientModule,
    CloudinaryModule,
    StripeModule,
    MediafileModule,
  ],
  controllers: [
    MembershipUseToUserOnly,
    MembershipController,
    MembershipRewardController,
  ],
  providers: [
    MembershipService,
    MembershipRewardService,
    MembershipServiceUseToUserOnly,
    PaymentInfoService,
  ],
})
export class MembershipModule {}
