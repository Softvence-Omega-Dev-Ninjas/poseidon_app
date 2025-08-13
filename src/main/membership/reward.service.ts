import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CreateVideoCallRewardDto } from './dto/create-video-call-reward.dto';
import { cResponseData } from 'src/common/utils/common-responseData';

@Injectable()
export class MembershipRewardService {
  constructor(private readonly prisma: PrismaService) {}

  async createVideoCallReward(
    createVideoCallRewardDto: CreateVideoCallRewardDto,
  ) {
    const newData = await this.prisma.membershipAccessToVideoCall.create({
      data: createVideoCallRewardDto,
    });
    return cResponseData({
      message: 'Video call reward created successfully',
      data: newData,
    });
  }
}
