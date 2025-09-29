import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
// import * as argon2 from 'argon2';

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






