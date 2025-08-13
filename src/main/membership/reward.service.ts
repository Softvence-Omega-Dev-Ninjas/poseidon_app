import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class MembershipRewardService {
  constructor(private readonly prisma: PrismaService) {}
}
