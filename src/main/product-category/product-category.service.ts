import { Injectable } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { FindAllProductCategoriesDto, ProductCategorySortBy } from './dto/find-all-product-categories.dto';
import { Prisma } from 'generated/prisma';

@Injectable()
export class ProductCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductCategoryDto: CreateProductCategoryDto) {
    const data = await this.prisma.productCategory.create({
      data: createProductCategoryDto,
    });
    return {
       message: 'create productCategory',
          redirect_url: null,
          error: null,
          data: data,
          success: true,
    }
  }

  async findAll(query: FindAllProductCategoriesDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const sortBy = query.sortBy;
    const skip = (page - 1) * limit;

    const orderBy: Prisma.ProductCategoryOrderByWithRelationInput = {};
    if (sortBy === ProductCategorySortBy.NEWEST) {
      orderBy.createdAt = 'desc';
    } else if (sortBy === ProductCategorySortBy.NAME) {
      orderBy.name = 'asc';
    }

    const [data, total] = await Promise.all([
      this.prisma.productCategory.findMany({
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.productCategory.count(),
    ]);

    return {
      data,
      total,
      currentPage: page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
     const data = await this.prisma.productCategory.findUnique({
      where: { id: id.toString() },
    });
    return {
       message: 'gest single productgetory',
          redirect_url: null,
          error: null,
          data: data,
          success: true,
    }
  }

  async update(id: string, updateProductCategoryDto: UpdateProductCategoryDto) {
     const data =  await this.prisma.productCategory.update({
      where: { id: id.toString() },
      data: updateProductCategoryDto,
    });
    return {
       message: 'update product-category',
          redirect_url: null,
          error: null,
          data: data,
          success: true,
    }
  }

  async remove(id: string) {
    const data = await this.prisma.productCategory.delete({
      where: { id: id.toString() },
    });
    return {
       message: 'update product-category',
          redirect_url: null,
          error: null,
          data: data,
          success: true,
    }
    
  }
}
