import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';
import { sendResponse } from 'src/common/utils/send-response.util';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // const payment = await this.prisma.payment.findUnique({
    //   where: { id: paymentId },
    // });
    // if (!payment) throw new NotFoundException('Payment not found');

    const product = await this.prisma.product.findUnique({
      where: { id: createOrderDto.productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    const order = await this.prisma.order.create({
      data: { ...createOrderDto, userId },
    });

    return sendResponse('Order created successfully', order, 201);
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
