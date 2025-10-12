import { HttpException, Injectable } from '@nestjs/common';
import { CreateSupporterPayDto } from './dto/create-supporter.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { SupportCartLayoutQuantity } from './dto/supportCartLayoutQuantity.dto';
import { CheersLivePackageType } from './dto/create-supporter-layout';
import { cResponseData } from 'src/common/utils/common-responseData';
import { UpdateSupporterLayputDto } from './dto/update-supporter.dto';
import { SupporterCardPaymentService } from 'src/utils/stripe/supporterCard.service';
import { BuyMembershipResponseDto } from '../membership/onluUseUserMembershipInfo/dto/buyMembership.dto';
import { StripeService } from 'src/utils/stripe/stripe.service';
import { CalendlyService } from '../calendly/calendly.service';
// import { UpdateSupporterDto } from './dto/update-supporter.dto';

@Injectable()
export class SupporterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supporterCardPaymentService: SupporterCardPaymentService,
    private readonly stripeService: StripeService,
    private readonly calendlyService: CalendlyService,
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

    if (!createNewData || !createNewData.id)
      return cResponseData({
        message: 'Create Failed',
        error: 'Create Failed',
        success: false,
      });

    const eventData = await this.calendlyService.createEvent({
      name: createNewData.package_name,
      description: createNewData.package_name,
      duration: Number(createNewData.package_time), // need to be get form input
    });

    await this.prisma.cheers_live_package_type.update({
      where: {
        id: createNewData.id,
      },
      data: {
        scheduling_url: eventData.resource.scheduling_url,
        uri: eventData.resource.uri,
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
    // const newSupport: any = await this.prisma.$transaction(async (tx) => {
    const supporterCardInfo = await this.prisma.supportCartLayout.findFirst({
      where: { id: pkId },
      // include: {},
      select: {
        id: true,
        author_id: true,
        author: {
          select: {
            stripeAccountId: true,
          },
        },
        cheers_live_package_type: {
          select: {
            id: true,
            package_name: true,
            package_price: true,
            package_time: true,
            scheduling_url: true,
            uri: true,
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

    const cheerslivepackagetype =
      await this.prisma.cheers_live_package_type.findFirst({
        where: {
          support_cart_layout_id: supporterCardInfo.id,
        },
      });

    const schedullink = {
      scheduling_url: '',
      uri: '',
    };

    if (
      cheerslivepackagetype &&
      cheerslivepackagetype?.scheduling_url &&
      cheerslivepackagetype.uri
    ) {
      schedullink.scheduling_url = `${cheerslivepackagetype.scheduling_url}?utm_term=${userid}&salesforce_uuid=${supporterCardInfo.author_id}&utm_medium=${supporterCardInfo.id}&utm_source=${'supportercard'}`;
      schedullink.uri = cheerslivepackagetype.uri;
    }

    const paymentPandingData = await this.prisma.supporterPay.create({
      data: {
        author_id: supporterCardInfo.author_id,
        total_price: rootData.total_price,
        user_id: userid ? userid : null,
        name: rootData.name,
        country: rootData.country,
        massage: rootData.message,
        scheduling_url: schedullink.scheduling_url,
        uri: schedullink.uri,
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
      await this.prisma.oder_package_name.create({
        data: {
          ...order_package_name,
          supporter_pay_id: paymentPandingData.id,
        },
      });
    }

    if (
      !paymentPandingData ||
      !supporterCardInfo ||
      !supporterCardInfo.author ||
      !supporterCardInfo.author.stripeAccountId
    ) {
      throw new HttpException(
        cResponseData({
          message: 'supporter card info Not Found',
          error: 'supporter card  payment issue',
          success: false,
        }),
        400,
      );
    }

    const payintigr = await this.supporterCardPaymentService.supportPayemnt({
      id: paymentPandingData.id,
      user_id: userid,
      author_id: paymentPandingData.author_id,
      total_price: paymentPandingData.total_price,
      stripeAccountId: supporterCardInfo.author.stripeAccountId,
    });

    return cResponseData({
      message: 'Create Success',
      data: payintigr,
    });
  }

  // payment status check
  async paymentStatusCheck(data: BuyMembershipResponseDto) {
    const payStatus = await this.stripeService.paymentIntentCheck(
      data.paymentIntentId,
    );
    if (!payStatus || payStatus.status !== 'succeeded' || !payStatus.id) {
      throw new HttpException(
        cResponseData({
          message: 'Payment failed',
          error: 'Payment failed',
          data: null,
          success: false,
        }),
        400,
      );
    }
    // console.log('paymentIntent - pi checkout', payStatus);
    if (payStatus.status === 'succeeded') {
      const paymentIntentData = await this.prisma.supporterPay.update({
        where: {
          id: payStatus.metadata.supporterPayTb,
        },
        data: {
          paymemtStatus: 'paid',
        },
        include: {
          oder_package_name: true,
        },
      });

      if (paymentIntentData && paymentIntentData.oder_package_name) {
        const scheduling_url = `${paymentIntentData.scheduling_url}?utm_term=${paymentIntentData.user_id}&salesforce_uuid=${paymentIntentData.author_id}&utm_medium=${paymentIntentData.id}&utm_source=${'supportercard'}`;
        return cResponseData({
          message: 'Payment successfully complated',
          data: paymentIntentData,
          scheduling_url,
          success: true,
        });
      }

      return cResponseData({
        message: 'Payment successfully complated',
        data: paymentIntentData,
        success: true,
      });
    }
    if (payStatus.status === 'canceled') {
      const paymentIntent = await this.prisma.supporterPay.update({
        where: {
          id: payStatus.metadata.supporterPayTb,
        },
        data: {
          paymemtStatus: 'canceled',
        },
      });
      return cResponseData({
        message: 'payment canceled ',
        data: paymentIntent,
        success: false,
      });
    }
  }

  async get3topCard(author_id: string) {
    // console.log(author_id, '2eb5c09d-fe1e-45c5-afc9-d9cb7ff023f2');
    const currentTime = new Date();
    return await this.prisma.$transaction(async (tx) => {
      const TotalSupportersCount =
        (await tx.supporterPay.count({
          where: {
            author_id: author_id,
            paymemtStatus: 'paid',
          },
        })) || 0;
      const currentMonthTotalSupportersCount =
        (await tx.supporterPay.count({
          where: {
            author_id: author_id,
            paymemtStatus: 'paid',
            createAt: {
              gte: new Date(
                currentTime.getFullYear(),
                currentTime.getMonth(),
                1,
              ),
              lt: new Date(
                currentTime.getFullYear(),
                currentTime.getMonth() + 1,
                1,
              ),
            },
          },
        })) || 0;

      const lastMonthErn = await tx.supporterPay.aggregate({
        where: {
          author_id: author_id,
          paymemtStatus: 'paid',
          createAt: {
            gte: new Date(currentTime.getFullYear(), currentTime.getMonth(), 1),
            lt: new Date(
              currentTime.getFullYear(),
              currentTime.getMonth() + 1,
              1,
            ),
          },
        },
        _sum: {
          total_price: true,
        },
      });

      const totalSupportersInLastMonth =
        (await tx.supporterPay.count({
          where: {
            author_id: author_id,
            paymemtStatus: 'paid',
            user_id: {
              not: null,
            },
            createAt: {
              gte: new Date(
                currentTime.getFullYear(),
                currentTime.getMonth(),
                1,
              ),
              lt: new Date(
                currentTime.getFullYear(),
                currentTime.getMonth() + 1,
                1,
              ),
            },
          },
        })) || 0;

      const allTime = await tx.supporterPay.aggregate({
        where: {
          author_id: author_id,
          paymemtStatus: 'paid',
        },
        _sum: {
          total_price: true,
        },
      });
      return {
        Supporters: { TotalSupportersCount, currentMonthTotalSupportersCount },
        Last30days: {
          lastMonthTotalAmount: lastMonthErn?._sum?.total_price
            ? lastMonthErn?._sum?.total_price
            : 0,
          totalSupportersInLastMonth,
        },
        allTime: allTime?._sum?.total_price ? allTime?._sum?.total_price : 0,
      };
    });
  }

  async suporterUserList(author_id: string) {
    return await this.prisma.supporterPay.findMany({
      where: {
        author_id: author_id,
        paymemtStatus: 'paid',
      },
      select: {
        id: true,
        name: true,
        user_id: true,
        massage: true,
        paymemtStatus: true,
        country: true,
        createAt: true,
        total_price: true,
        user: {
          select: {
            profile: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });
  }
}
