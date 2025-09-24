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
          buyerId: '3e7572ca-4c09-4e37-b984-0913e183c83c',
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

      const sellerIds = memberships.flatMap(
        (membership) => membership.sellerId,
      );

      return sellerIds;
    });
    return data;
  }
}
