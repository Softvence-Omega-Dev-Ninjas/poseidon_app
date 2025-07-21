import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

import { UseGuards } from '@nestjs/common';
import { AuthGuardGuard } from 'src/auth/auth_guard/auth_guard.guard';

@ApiTags('ProductCategory')
@UseGuards(AuthGuardGuard)
@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Post()
  create(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    return this.productCategoryService.create(createProductCategoryDto);
  }

  @Get()
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit the number of product categories returned',
  })
  findAll(@Query('limit') limit?: number) {
    return this.productCategoryService.findAll(limit ? +limit : undefined);
  }
}
