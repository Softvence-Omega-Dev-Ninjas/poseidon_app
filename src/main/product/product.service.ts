import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return await this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return await this.prisma.product.findMany({
      skip,
      take: limit,
    });
  }

  async findOne(id: string) {
    return await this.prisma.product.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.product.delete({ where: { id } });
  }

  async findByShopId(shopId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    return await this.prisma.product.findMany({
      where: { shopId },
      skip,
      take: limit,
    });
  }
}