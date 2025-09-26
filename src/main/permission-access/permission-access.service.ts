import { Injectable } from '@nestjs/common';
// import { AccesPermissionAccessDto } from './dto/create-permission-access.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
// import { UpdatePermissionAccessDto } from './dto/update-permission-access.dto';

@Injectable()
export class PermissionAccessService {
  constructor(private readonly prisma: PrismaService) {}
  async findAccesPermit(buyerid: string, berGirlId: string) {
    // const endtime = accesPermissionAccessDto.endDate
    //   ? new Date(accesPermissionAccessDto.endDate)
    //   : new Date();

    const permitAccess = {
      PermissionGalleryAccess: false,
      PermissionPostsAccess: false,
      PermissionMessagesAccess: false,
      PermissionVideoCallAccess: false,
    };

    const permitData = await this.prisma.paymentDetails.findMany({
      where: {
        buyerId: buyerid,
        sellerId: berGirlId,
        paymemtStatus: 'paid',
        endDate: {
          gte: new Date(),
        },
      },
      select: {
        PermissionGalleryAccess: true,
        PermissionPostsAccess: true,
        PermissionMessagesAccess: true,
        PermissionVideoCallAccess: true,
      },
    });

    permitData.map((value) => {
      if (value.PermissionGalleryAccess) {
        permitAccess.PermissionGalleryAccess = true;
      }
      if (value.PermissionPostsAccess) {
        permitAccess.PermissionPostsAccess = true;
      }
      if (value.PermissionMessagesAccess) {
        permitAccess.PermissionMessagesAccess = true;
      }
      if (value.PermissionVideoCallAccess) {
        permitAccess.PermissionVideoCallAccess = true;
      }
    });

    return permitAccess;
  }
}
