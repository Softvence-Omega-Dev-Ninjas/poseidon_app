import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { UserService } from 'src/main/user/user.service';

@Injectable()
export class AdminOverviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getStats() {
    const totalUser = await this.prisma.user.count();
    const today = new Date().toISOString().split('T')[0]; // Get today’s date in yyyy-mm-dd format
    const visitorCount = await this.userService.getDailyVisitCount(today);
    const visitorStats = await this.userService.getTrafficStats(7); // Last 7 days
    return {
      totalUser,
      visitors: {
        today,
        count: visitorCount,
        stats: visitorStats,
      },
    };
  }
}
