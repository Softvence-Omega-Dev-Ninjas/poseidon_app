import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductCategoryDto: CreateProductCategoryDto) {
    return await this.prisma.productCategory.create({
      data: createProductCategoryDto,
    });
  }

  async findAll(limit?: number) {
    return await this.prisma.productCategory.findMany({
      take: limit,
    });
  }
}
