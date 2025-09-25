import { Injectable } from '@nestjs/common';
import { CreateSupporterPayDto } from './dto/create-supporter.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { SupportCartLayoutQuantity } from './dto/supportCartLayoutQuantity.dto';
import { CheersLivePackageType } from './dto/create-supporter-layout';
import { cResponseData } from 'src/common/utils/common-responseData';
import { UpdateSupporterLayputDto } from './dto/update-supporter.dto';
import { SupporterCardPaymentService } from 'src/utils/stripe/supporterCard.service';
// import { UpdateSupporterDto } from './dto/update-supporter.dto';

@Injectable()
export class SupporterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supporterCardPaymentService: SupporterCardPaymentService,
  ) {}

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
    const updateCartLayout = await this.prisma.supportCartLayout.update({
      where: { author_id: userid },
      data: {
        default_price: data.default_price,
        choose_layout:
          data.choose_layout == 'suggest'
            ? 'suggest'
            : data.choose_layout == 'standard'
              ? 'standard'
              : 'standard',
      },
    });
    return cResponseData({
      message: 'Update Success',
      data: updateCartLayout,
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
  async create(createSupporterDto: CreateSupporterPayDto, userid: string) {
    const { order_package_name, id: pkId, ...rootData } = createSupporterDto;

    if (!!order_package_name && !userid) {
      return {
        message: 'User id is required',
        error: 'No data found',
        success: false,
        redirect_url: `${process.env.FRONTEND_URL}/login`,
      };
    }
    const newSupport = await this.prisma.$transaction(async (tx) => {
      const supporterCardInfo = await tx.supportCartLayout.findUnique({
        where: { id: pkId },
        select: {
          id: true,
          author_id: true,
          author: {
            select: {
              stripeAccountId: true,
            },
          },
        },
      });
      if (!supporterCardInfo) {
        return cResponseData({
          message: 'No data found',
          error: 'No data found',
          success: false,
        });
      }

      const paymentPandingData = await tx.supporterPay.create({
        data: {
          author_id: supporterCardInfo.author_id,
          total_price: rootData.total_price,
          name: rootData.name,
          country: rootData.country,
          massage: rootData.message,
        },
        select: {
          id: true,
          total_price: true,
          author_id: true,
        },
      });

      if (
        order_package_name &&
        order_package_name.package_name &&
        paymentPandingData &&
        paymentPandingData.id
      ) {
        await tx.oder_package_name.create({
          data: {
            ...order_package_name,
            supporter_pay_id: paymentPandingData.id,
          },
        });
        return {
          stripeAccountId: supporterCardInfo.author.stripeAccountId,
          ...paymentPandingData,
        };
        // return await this.supporterCardPaymentService.supportPayemnt({
        //   id: paymentPandingData.id,
        //   user_id: userid,
        //   author_id: paymentPandingData.author_id,
        //   total_price: paymentPandingData.total_price,
        //   stripeAccountId: supporterCardInfo.author.stripeAccountId,
        // });
      }
      return {
        ...paymentPandingData,
        stripeAccountId: supporterCardInfo.author.stripeAccountId,
      };
    });

    // const { id } = newSupport;

    // const payintigr = await this.supporterCardPaymentService.supportPayemnt({
    //   id: newSupport.id,
    //   user_id: userid,
    //   author_id: '',
    //   total_price: 34,
    //   stripeAccountId: '',
    // });

    return cResponseData({
      message: 'Create Success',
      data: newSupport,
    });
  }
}
