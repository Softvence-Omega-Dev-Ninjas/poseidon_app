import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { MembershipRewardService } from './reward.service';
import { MembershipRewardController } from './reward.controller';

@Module({
  imports: [PrismaClientModule],
  controllers: [MembershipController, MembershipRewardController],
  providers: [MembershipService, MembershipRewardService],
})
export class MembershipModule {}
