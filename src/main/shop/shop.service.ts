import { Injectable } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class ShopService {
  constructor(private readonly prisma: PrismaService) {}

  create(createShopDto: CreateShopDto) {
    return this.prisma.shop.create({ data: createShopDto });
  }

  findAll() {
    return this.prisma.shop.findMany();
  }

  findOne(id: string) {
    return this.prisma.shop.findUnique({ where: { id } });
  }

  update(id: string, updateShopDto: UpdateShopDto) {
    return this.prisma.shop.update({ where: { id }, data: updateShopDto });
  }

  remove(id: string) {
    return this.prisma.shop.delete({ where: { id } });
  }
}
