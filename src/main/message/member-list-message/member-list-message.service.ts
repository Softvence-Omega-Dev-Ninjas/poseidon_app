import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
// import { CreateMemberListMessageDto } from './dto/create-member-list-message.dto';
// import { UpdateMemberListMessageDto } from './dto/update-member-list-message.dto';

@Injectable()
export class MemberListMessageService {
  constructor(private readonly prisma: PrismaService) {}

  async findMembershipList(userId: string) {
    const data = await this.prisma.$transaction(async (tx) => {
      const memberships = await tx.paymentDetails.findMany({
        where: {
          buyerId: userId,
          // paymemtStatus: 'paid',
          endDate: {
            gte: new Date(),
          },
          PermissionMessagesAccess: {
            isNot: null,
          },
        },
        select: {
          sellerId: true,
        },
      });
      const sellerIds = [
        ...new Set(memberships.flatMap((membership) => membership.sellerId)),
      ];

      const berGirlLis = await tx.user.findMany({
        where: {
          id: {
            in: sellerIds,
          },
          role: 'supporter',
        },
        select: {
          id: true,
          profile: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });

      return berGirlLis;
    });
    return data;
  }
}
