import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async getMessagePermittedSupportersForUser(userId: string) {
    const now = new Date();

    // Find permission records where either unlimited OR payment is paid and not expired
    const perms = await this.prisma.permissionMessagesAccess.findMany({
      where: {
        user_id: userId,
        OR: [
          { unlimitedMessages: true },
          {
            paymentDetails: {
              paymemtStatus: 'paid',
              endDate: { gte: now },
            },
          },
        ],
      },
      include: {
        supporter: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            profile: true, // includes profile fields if present
          },
        },
        paymentDetails: true,
      },
    });

    // For each permission compute used/remaining messages (requires Message model)
    const results = await Promise.all(
      perms.map(async (p) => {
        let usedMessages = 0;
        let remainingMessages: number | 'unlimited' | null = null;

        if (p.unlimitedMessages) {
          remainingMessages = 'unlimited';
        } else {
          // Count messages sent by the supporter to the user since permission.createAt
          // Adjust filter if you want to count both directions or across entire history.
          usedMessages = await this.prisma.message.count({
            where: {
              senderId: p.supporter_id,
              receiverId: userId,
              createdAt: { gte: p.createAt },
            },
          });

          remainingMessages = Math.max(0, p.totalMessages - usedMessages);
        }

        return {
          permissionId: p.id,
          supporter: p.supporter,
          totalMessages: p.totalMessages,
          unlimitedMessages: p.unlimitedMessages,
          usedMessages,
          remainingMessages,
          paymentDetails: p.paymentDetails,
          permissionCreatedAt: p.createAt,
        };
      }),
    );

    return results;
  }

  async getUsersThatSupporterCanMessage(authId: string) {
    const now = new Date();
    const perms = await this.prisma.permissionMessagesAccess.findMany({
      where: {
        supporter_id: authId,
        OR: [
          { unlimitedMessages: true },
          {
            paymentDetails: {
              paymemtStatus: 'paid',
              endDate: { gte: now },
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            profile: true,
            role: true,
          },
        },
        paymentDetails: true,
      },
    });

    const results = await Promise.all(
      perms.map(async (p) => {
        let usedMessages = 0;
        let remainingMessages: number | 'unlimited' | null = null;

        if (p.unlimitedMessages) {
          remainingMessages = 'unlimited';
        } else {
          usedMessages = await this.prisma.message.count({
            where: {
              senderId: authId,
              receiverId: p.user_id,
              createdAt: { gte: p.createAt },
            },
          });
          remainingMessages = Math.max(0, p.totalMessages - usedMessages);
        }

        return {
          permissionId: p.id,
          user: p.user,
          totalMessages: p.totalMessages,
          unlimitedMessages: p.unlimitedMessages,
          usedMessages,
          remainingMessages,
          paymentDetails: p.paymentDetails,
          permissionCreatedAt: p.createAt,
        };
      }),
    );

    return results;
  }
}
