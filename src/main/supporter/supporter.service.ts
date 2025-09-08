import { Injectable } from '@nestjs/common';
import { CreateSupporterPayDto } from './dto/create-supporter.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { SupportCartLayoutQuantity } from './dto/supportCartLayoutQuantity.dto';
import { CheersLivePackageType } from './dto/create-supporter-layout';
import { cResponseData } from 'src/common/utils/common-responseData';
import { UpdateSupporterLayputDto } from './dto/update-supporter.dto';
// import { UpdateSupporterDto } from './dto/update-supporter.dto';

@Injectable()
export class SupporterService {
  constructor(private readonly prisma: PrismaService) {}

  async getSupporterCartLayout(userId: string) {
    const getCartLayout = await this.prisma.supportCartLayout.findMany({
      where: {
        author_id: userId,
      },
      include: {
        cheers_live_package_type: true,
        SuggestQuantity: true,
      },
    });
    return cResponseData({
      message: 'Get Data Success',
      data: getCartLayout,
    });
  }

  async upadteSupporterCardLayout(
    userid: string,
    data: UpdateSupporterLayputDto,
  ) {
    const card = await this.prisma.supportCartLayout.findFirst({
      where: {
        author_id: userid,
      },
      select: {
        id: true,
      },
    });
    // const updateCartLayout = await this.prisma.supportCartLayout.update({
    //   where: {
    //     id: card?.id,
    //   },
    //   data: {
    //     ...data,
    //     cheers_live_package_type: {
    //       update: {
    //         where: {
    //           support_cart_layout_id: card?.id,
    //         },
    //         data: {
    //           ...data.cheers_live_package_type,
    //         },
    //       },
    //     },
    //   },
    // });
    return cResponseData({
      message: 'Update Success',
      data: card,
    });
  }

  async createSuggestQuantity(quantityData: SupportCartLayoutQuantity) {
    return await this.prisma.supportCartLayoutQuantity.create({
      data: {
        ...quantityData,
      },
    });
  }

  async deleteSuggestQuantity(id: string) {
    return await this.prisma.supportCartLayoutQuantity.delete({
      where: {
        id,
      },
    });
  }

  async createCheersLivePackageType(id: string, data: CheersLivePackageType) {
    const createNewData = await this.prisma.cheers_live_package_type.create({
      data: {
        ...data,
        support_cart_layout_id: id,
      },
    });
    return cResponseData({
      message: 'Create Success',
      data: createNewData,
    });
  }

  async updateCheersLivePackageType(id: string, data: CheersLivePackageType) {
    const updateData = await this.prisma.cheers_live_package_type.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
    return cResponseData({
      message: 'Update Success',
      data: updateData,
    });
  }

  async deleteCheersLivePackageType(id: string) {
    return cResponseData({
      message: 'Delete Success',
      data: await this.prisma.cheers_live_package_type.delete({
        where: {
          id,
        },
      }),
    });
  }

  // buy support on
  async create(createSupporterDto: CreateSupporterPayDto) {
    const { oder_package_name, ...rootData } = createSupporterDto;

    const newSupporter = await this.prisma.$transaction(async (tx) => {
      const supporter = await tx.supporterPay.create({
        data: {
          ...rootData,
        },
      });

      if (!oder_package_name) return supporter;

      const newPackage = await tx.oder_package_name.create({
        data: {
          supporter_pay_id: supporter.id,
          ...oder_package_name,
        },
      });
      return {
        ...supporter,
        oder_package_name: newPackage,
      };
    });

    return cResponseData({
      message: 'Create Success',
      data: newSupporter,
    });
  }
}
