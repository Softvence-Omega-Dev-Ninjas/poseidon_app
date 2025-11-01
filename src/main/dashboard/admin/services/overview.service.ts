import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { UserService } from 'src/main/user/user.service';

type MonthlyIncome = {
  totalAmount: number;
  adminNetIncome: number;
  servicePayments: number;
  shopPayments: number;
  supporterPayments: number;
  membershipPayments: number;
};

@Injectable()
export class AdminOverviewService {
  private readonly ADMIN_COMMISION = 0.1;
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getStats() {
    const totalUser = await this.prisma.user.count({
      where: {
        deactivate: false,
      },
    });
    const today = new Date().toISOString().split('T')[0]; // Get today’s date in yyyy-mm-dd format
    const visitorCount = await this.userService.getDailyVisitCount(today);
    const visitorStats = await this.userService.getTrafficStats(7); // Last 7 days
    const adminNetIncome = await this.calculateAdminNetIncome();

    return {
      totalUser,
      visitors: {
        today,
        count: visitorCount,
        stats: visitorStats,
      },
      incomes: {
        ...adminNetIncome,
      },
    };
  }
  async getIncomeStats(month: number, year: number) {
    const income = await this.calculateIncome(month, year);
    const daysIncome = await this.calculateIncomeByDay(month, year);
    return {
      netIncome: income.adminNetIncome,
      totalAmount: income.totalAmount,
      daysIncome: daysIncome,
    };
  }
  async calculateAdminNetIncome() {
    // Net Income
    // PaymentDetailsByServices
    // PaymentDetailsByShop
    // SupporterPay
    const servicePayment = await this.prisma.paymentDetailsByServices.aggregate(
      {
        where: {
          paymemtStatus: 'paid',
        },
        _sum: {
          amount: true,
        },
      },
    );

    const shopPayment = await this.prisma.paymentDetailsByShop.aggregate({
      where: {
        paymemtStatus: 'paid',
      },
      _sum: {
        amount: true,
      },
    });

    const supporterPayment = await this.prisma.supporterPay.aggregate({
      where: {
        paymemtStatus: 'paid',
      },
      _sum: {
        total_price: true,
      },
    });
    const paymentDetails = await this.prisma.paymentDetails.aggregate({
      where: {
        paymemtStatus: 'paid',
      },
      _sum: {
        amount: true,
      },
    });
    // Calculate total amount

    const servicePaymentNetIncome = servicePayment._sum.amount || 0;
    const shopPaymentNetIncome = shopPayment._sum.amount || 0;
    const supporterPaymentNetIncome = supporterPayment._sum.total_price || 0;
    const paymentDetailsNetIncome = paymentDetails._sum.amount || 0;

    const totalAmount =
      servicePaymentNetIncome +
      shopPaymentNetIncome +
      supporterPaymentNetIncome +
      paymentDetailsNetIncome;

    // Get 10% from all income
    const adminNetIncome = totalAmount * this.ADMIN_COMMISION;
    return {
      adminNetIncome,
      servicePaymentNetIncome: servicePaymentNetIncome * this.ADMIN_COMMISION,
      shopPaymentNetIncome: shopPaymentNetIncome * this.ADMIN_COMMISION,
      supporterPaymentNetIncome:
        supporterPaymentNetIncome * this.ADMIN_COMMISION,
      membershipPaymentNetIncome:
        paymentDetailsNetIncome * this.ADMIN_COMMISION,
    };
  }
  async calculateIncomeByDay(month: number, year: number) {
    const endDate = new Date(year, month, 0);

    const dates = Array.from({ length: endDate.getDate() }, (_, i) => i + 1); // Days of the month
    const dailyIncome: number[] = [];

    for (const date of dates) {
      const dayStart = new Date(year, month - 1, date);
      const dayEnd = new Date(year, month - 1, date + 1);
      const income = await this.calculateIncome(dayStart, dayEnd);
      dailyIncome.push(income.adminNetIncome);
    }

    return {
      labels: dates, // Days of the month
      values: dailyIncome, // Total income for each day
    };
  }
  async calculateIncome(
    month: number | Date,
    year: number | Date,
  ): Promise<MonthlyIncome> {
    // Get the first day of the month
    let startDate: number | Date;
    let endDate: number | Date;

    if (month instanceof Date && year instanceof Date) {
      startDate = month;
      endDate = year;
    } else {
      startDate = new Date(year as number, (month as number) - 1, 1);
      endDate = new Date(year as number, month as number, 0); // End date is the last day of the month
    }

    const servicePayments =
      await this.prisma.paymentDetailsByServices.aggregate({
        _sum: { amount: true },
        where: {
          paymemtStatus: 'paid',
          createAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

    const shopPayments = await this.prisma.paymentDetailsByShop.aggregate({
      _sum: { amount: true },
      where: {
        paymemtStatus: 'paid',
        createAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const supporterPayments = await this.prisma.supporterPay.aggregate({
      _sum: { total_price: true },
      where: {
        paymemtStatus: 'paid',
        createAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const paymentDetails = await this.prisma.paymentDetails.aggregate({
      _sum: { amount: true },
      where: {
        paymemtStatus: 'paid',
        createAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Calculate total income for the month
    const totalAmount =
      (servicePayments._sum.amount || 0) +
      (shopPayments._sum.amount || 0) +
      (supporterPayments._sum.total_price || 0) +
      (paymentDetails._sum.amount || 0);

    // Admin's net income is 10% of the total amount
    const adminNetIncome = totalAmount * this.ADMIN_COMMISION;

    return {
      totalAmount,
      adminNetIncome,
      servicePayments: servicePayments._sum.amount || 0,
      shopPayments: shopPayments._sum.amount || 0,
      supporterPayments: supporterPayments._sum.total_price || 0,
      membershipPayments: paymentDetails._sum.amount || 0,
    };
  }

  async visitorChart() {
    return await this.userService.getVisitsByCountry();
  }

  async getTopUpIncomeBarGirlProfile() {
    const berGrilProfiles = await this.prisma.user.findMany({
      where: {
        role: 'supporter',
      },
      select: {
        id: true,
        username: true,
        email: true,
        profile: {
          select: {
            name: true,
            image: true,
            description: true,
          },
        },
      },
    });

    const profilesWithIncome = await Promise.all(
      berGrilProfiles.map(async (girlProfile) => {
        const totalAmount = await this.getGirlTopUpIncome(girlProfile.id);
        return { ...girlProfile, totalAmount };
      }),
    );
    return profilesWithIncome
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5);
  }

  private async getGirlTopUpIncome(girlId: string) {
    const servicePayment = await this.prisma.paymentDetailsByServices.aggregate(
      {
        where: {
          paymemtStatus: 'paid',
          serviceOrderInfo: {
            sellerId: girlId,
          },
        },
        _sum: {
          amount: true,
        },
      },
    );

    const shopPayment = await this.prisma.paymentDetailsByShop.aggregate({
      where: {
        paymemtStatus: 'paid',
        order: {
          product: {
            shop: {
              userId: girlId,
            },
          },
        },
      },
      _sum: {
        amount: true,
      },
    });

    const supporterPayment = await this.prisma.supporterPay.aggregate({
      where: {
        paymemtStatus: 'paid',
        author_id: girlId,
      },
      _sum: {
        total_price: true,
      },
    });

    const paymentDetails = await this.prisma.paymentDetails.aggregate({
      where: {
        paymemtStatus: 'paid',
        sellerId: girlId,
      },
      _sum: {
        amount: true,
      },
    });
    // Calculate total amount
    const totalAmount =
      (servicePayment._sum.amount || 0) +
      (shopPayment._sum.amount || 0) +
      (paymentDetails._sum.amount || 0) +
      (supporterPayment._sum.total_price || 0);

    return Number(totalAmount.toFixed(2));
  }
}
