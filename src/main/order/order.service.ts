import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({ data: createOrderDto });
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

    return {
      orders,
      currentPage: parsedPage,
      limit: parsedLimit,
      totalPages,
    };
  }

  findOne(id: string) {
    return this.prisma.order.findUnique({ where: { id } });
  }
}
