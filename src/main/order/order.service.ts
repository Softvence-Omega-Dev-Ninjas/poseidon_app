import { Injectable } from '@nestjs/common';

import { CreateOrderDto } from './dto/create-order.dto';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { sendResponse } from 'src/common/utils/send-response.util';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    try {
      const order = await this.prisma.order.create({
        data: { ...createOrderDto, userId },
      });

      return sendResponse('Order created successfully', order, 201);
    } catch (error) {
      console.error('Create Order Error:', error);

      let statusCode = 500;
      let message = 'Failed to create order';

      if (error.code === 'P2002') {
        statusCode = 400;
        message = 'Duplicate order not allowed';
      }

      return sendResponse(
        message,
        null,
        statusCode,
        null,
        error?.message || String(error as Error),
        false,
      );
    }
  }

  async findAll(query: FindAllOrdersDto) {
    try {
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
            product: true,
          },
        }),
        this.prisma.order.count({ where }),
      ]);

      const totalPages = Math.ceil(total / parsedLimit);

      const result = {
        orders,
        currentPage: parsedPage,
        limit: parsedLimit,
        totalPages,
        totalItems: total,
      };

      return sendResponse('Orders fetched successfully', result);
    } catch (error) {
      console.error('FindAll Order Error:', error);
      return sendResponse(
        'Failed to fetch orders',
        null,
        500,
        null,
        error?.message || String(error as Error),
        false,
      );
    }
  }

  async findOne(id: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: { product: true },
      });

      if (!order) {
        return sendResponse(
          'Order not found',
          null,
          404,
          null,
          'No order exists with the given ID',
          false,
        );
      }

      return sendResponse('Order fetched successfully', order);
    } catch (error) {
      console.error('FindOne Order Error:', error);
      return sendResponse(
        'Failed to fetch order',
        null,
        500,
        null,
        error?.message || String(error as Error),
        false,
      );
    }
  }

  async findAllByUserId(userId: string) {
    try {
      const orders = await this.prisma.order.findMany({
        where: { userId },
        include: { product: true },
      });

      return sendResponse('Orders fetched successfully', orders);
    } catch (error) {
      console.error('FindAllByUserId Order Error:', error);
      return sendResponse(
        'Failed to fetch orders',
        null,
        500,
        null,
        error?.message || String(error as Error),
        false,
      );
    }
  }
}
