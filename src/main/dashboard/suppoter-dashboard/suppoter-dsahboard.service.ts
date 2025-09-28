import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class ReferralService {
  constructor(private prisma: PrismaService) {}

  // Referral link generate
  async getReferralLink( userId: string) {
    try{
         const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new Error('User not found');

    const baseUrl = process.env.FRONTEND_URL || 'https://drinkwithme.click';
    return {
      referralLink: `${baseUrl}/supporter-signup?referralId=${user?.id}`,
    };
    }catch(err){
      console.log(err);
      return err
    }
  }

  // Referral signups count
  async getSignUps(userId: string) {
    const inviter = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!inviter) throw new Error('User not found');

    const count = await this.prisma.referral.count({
      where: { inviterId: userId },
    });
   console.log(count)

    return { signUps: count };
  }


}