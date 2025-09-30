import { Injectable } from '@nestjs/common';
import { PaymemtStatus, ServiceType } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

// import * as argon2 from 'argon2';

@Injectable()
export class ReferralService {
  constructor(private prisma: PrismaService) {}

  // Referral signups count
  async getSignUps(userId: string) {
    const inviter = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!inviter) throw new Error('User not found');

    const count = await this.prisma.referral.count({
      where: { inviterId: userId },
    });
    return { signUps: count };
  }

// get earning, supporters, member, service.
 async getOverview(userId: string) {
    // Earnings sum of all paid transactions for this seller
    const earnings = await this.prisma.paymentDetails.aggregate({
      where: { sellerId: userId, paymemtStatus: PaymemtStatus.paid },
      _sum: { amount: true },
    });


    // Supporters unique buyers who paid for support
    const supporters = await this.prisma.paymentDetails.findMany({
      where: { sellerId: userId, paymemtStatus: PaymemtStatus.paid },
      select: { buyerId: true },
    });
    const supporterCount = new Set(supporters.map(s => s.buyerId)).size;
   

    // Memberships unique buyers who paid for membership
    const memberships = await this.prisma.paymentDetails.findMany({
      where: { sellerId: userId, serviceType: ServiceType.membership, paymemtStatus: PaymemtStatus.paid },
      select: { buyerId: true },
    });
    const membershipCount = new Set(memberships.map(m => m.buyerId)).size;

    // Services count how many service purchases completed
    const servicesCount = await this.prisma.serviceOrder.count({
      where: { sellerId: userId, paymentDetails: { paymemtStatus: PaymemtStatus.paid } },
    });

    return {
      earning: earnings._sum.amount || 0,
      supporters: supporterCount,
      membership: membershipCount,
      services: servicesCount,
    };
  }

  //   // update user account
  //  async updateUser(
  //     userId: string,
  //     dto: UpdateAccountDto,
  //     image?: Express.Multer.File,
  //   ) {
  //     const user = await this.prisma.user.findUnique({ where: { id: userId } });
  //     if (!user) {
  //       throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //     }

  //     // console.log(user.)
  //     // handle profile image upload
  //     let imageUrl = user.profile?.image;
  //     if (image) {
  //       const { imageUrl: uploadedUrl } =
  //         await this.cloudinaryService.profileImageUpload(image);
  //       imageUrl = uploadedUrl;
  //     }

  //     // handle password update
  //     let hashedPassword = user.password;
  //     if (dto.password) {
  //       if (dto.password !== dto.confirmPassword) {
  //         throw new HttpException(
  //           'Passwords do not match',
  //           HttpStatus.BAD_REQUEST,
  //         );
  //       }
  //       hashedPassword = await argon2.hash(dto.password);
  //     }

  //     const updatedUser = await this.prisma.user.update({
  //       where: { id: userId },
  //       data: {
  //         email: dto.email || user.email,
  //         password: hashedPassword,
  //         profile: {
  //           update: {
  //             name: dto.name || user.profile?.name,
  //             country: dto.country || user.profile?.country,
  //             image: imageUrl,
  //           },
  //         },
  //       },
  //       select: {
  //         id: true,
  //         email: true,
  //         profile: { select: { name: true, country: true, image: true } },
  //       },
  //     });

  //     return {
  //       message: 'Account updated successfully',
  //       data: updatedUser,
  //       success: true,
  //     };
  //   }

  //   async deleteAccount(userId: string) {
  //     return this.prisma.user.delete({ where: { id: userId } });
  //   }
}
