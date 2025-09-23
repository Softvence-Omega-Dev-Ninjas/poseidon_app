import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';
import { sendResponse } from 'src/common/utils/send-response.util';
import { cResponseData } from 'src/common/utils/common-responseData';
import { ShopPaymentService } from 'src/utils/stripe/shopPayment.service';
import { ShopPaymentDto } from 'src/utils/stripe/dto/shopPayment.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly shopPaymentService: ShopPaymentService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const productInfo = await this.prisma.product.findUnique({
      where: { id: createOrderDto.productId },
    });
    if (!productInfo || !productInfo.id)
      throw new HttpException(
        cResponseData({
          message: 'Product not found',
          success: false,
        }),
        404,
      );
    const orderCreatedPending = await this.prisma.order.create({
      data: {
        ...createOrderDto,
        color: createOrderDto.color,
        userId: userId ? userId : null,
        paymentDetailsByShop: {
          create: {
            amount: productInfo.price,
          },
        },
      },
      include: {
        product: {
          select: {
            id: true,
            shop: {
              select: {
                user: {
                  select: {
                    id: true,
                    stripeAccountId: true,
                  },
                },
              },
            },
          },
        },
        paymentDetailsByShop: {
          select: {
            id: true,
            amount: true,
          },
        },
      },
    });
    const paydata: ShopPaymentDto = {
      stripeAccountId: orderCreatedPending.product.shop.user
        .stripeAccountId as string,
      paymentDetailsId: orderCreatedPending.paymentDetailsByShop?.id as string,
      shopOrderId: orderCreatedPending.id,
      productId: orderCreatedPending.product.id,
      userId: userId,
      amount: orderCreatedPending.paymentDetailsByShop?.amount as number,
      name: createOrderDto.fullName,
      email: createOrderDto.email,
    };
    if (
      !paydata.stripeAccountId ||
      !paydata.paymentDetailsId ||
      !paydata.shopOrderId
    )
      throw new HttpException(
        cResponseData({
          message: 'Product Buy faild',
          error: 'author info missing and do not create order',
          success: false,
        }),
        400,
      );
    const createPiStrpekey =
      await this.shopPaymentService.shopPaymentIntent(paydata);

    if (
      !createPiStrpekey ||
      !createPiStrpekey.client_secret ||
      !createPiStrpekey.id
    )
      throw new HttpException(
        cResponseData({
          message: 'Payment Intents Faild',
          error: 'payament error',
          data: null,
          success: false,
        }),
        400,
      );

    console.log('shop paydata =====>>>>>', paydata);
    console.log('createPiStrpekey ======>>>>>', createPiStrpekey);

    return createPiStrpekey.client_secret;
  }

  async findAll(query: FindAllOrdersDto) {
    const { page = 1, limit = 10, price, email, fullName } = query;
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);
    const skip = (parsedPage - 1) * parsedLimit;
    const where: any = {};

    if (price) {
      where.product = {
        price: Number(price),
      };
    }

    if (email) {
      where.email = {
        contains: email,
        mode: 'insensitive',
      };
    }

    if (fullName) {
      where.fullName = {
        contains: fullName,
        mode: 'insensitive',
      };
    }

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip,
        take: parsedLimit,
        include: {
          product: true, // Include product details if needed
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    const totalPages = Math.ceil(total / parsedLimit);

    const data = {
      orders,
      total,
      currentPage: parsedPage,
      limit: parsedLimit,
      totalPages,
    };

    return sendResponse('Orders retrieved successfully', data, 200);
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return sendResponse('Order retrieved successfully', order, 200);
  }
}
