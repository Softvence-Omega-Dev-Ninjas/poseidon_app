import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);

  constructor(private prisma: PrismaService) {}

  async getMessagePermittedSupportersForUser(userId: string) {
    try {
      const now = new Date();

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
              profile: true,
            },
          },
          paymentDetails: true,
        },
      });

      const results = await Promise.all(
        perms.map(async (p) => {
          try {
            let usedMessages = 0;
            let remainingMessages: number | 'unlimited' | null = null;

            if (p.unlimitedMessages) {
              remainingMessages = 'unlimited';
            } else {
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
          } catch (innerErr) {
            this.logger.error(
              `Failed processing permission ${p.id} for user ${userId}`,
              innerErr,
            );
            return null;
          }
        }),
      );

      return {
        success: true,
        data: results.filter((r) => r !== null),
        message: 'Permitted supporters fetched successfully',
      };
    } catch (err) {
      this.logger.error(
        `Failed to fetch permitted supporters for user ${userId}`,
        err,
      );
      throw new InternalServerErrorException(
        'Could not fetch permitted supporters. Please try again later.',
      );
    }
  }

  async getUsersThatSupporterCanMessage(authId: string) {
    try {
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
          try {
            let usedMessages = 0;
            let remainingMessages: number | 'unlimited' | null = null;

            if (p.unlimitedMessages) {
              remainingMessages = 'unlimited';
            } else {
              usedMessages = await this.prisma.message.count({
                where: {
                  senderId: authId,
                  receiverId: p.user_id ?? '',
                  createdAt: { gte: p.createAt },
                },
              });
              remainingMessages = Math.max(0, p.totalMessages - usedMessages);
            }

            // return {
            //   permissionId: p.id,
            //   user: p.user,
            //   totalMessages: p.totalMessages,
            //   unlimitedMessages: p.unlimitedMessages,
            //   usedMessages,
            //   remainingMessages,
            //   paymentDetails: p.paymentDetails,
            //   permissionCreatedAt: p.createAt,
            // };
            return p.user;
          } catch (innerErr) {
            this.logger.error(
              `Failed processing permission ${p.id} for supporter ${authId}`,
              innerErr,
            );
            return null;
          }
        }),
      );

      return {
        success: true,
        data: results.filter((r) => r !== null),
        message: 'Users fetched successfully',
      };
    } catch (err) {
      this.logger.error(`Failed to fetch users for supporter ${authId}`, err);
      throw new InternalServerErrorException(
        'Could not fetch users. Please try again later.',
      );
    }
  }
}
