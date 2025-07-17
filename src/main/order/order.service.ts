import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({ data: createOrderDto });
  }

  findAll() {
    return this.prisma.order.findMany();
  }

  findOne(id: string) {
    return this.prisma.order.findUnique({ where: { id } });
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.prisma.order.update({ where: { id }, data: updateOrderDto });
  }

  remove(id: string) {
    return this.prisma.order.delete({ where: { id } });
  }

  findByShopId(shopId: string) {
    return this.prisma.order.findMany({ where: { product: { shopId } } });
  }

  findByUserId(userId: string) {
    return this.prisma.order.findMany({ where: { userId } });
  }
}
