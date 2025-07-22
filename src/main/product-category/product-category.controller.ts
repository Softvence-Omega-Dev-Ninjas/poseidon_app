import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';


@ApiTags('ProductCategory')
@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}
  @Roles( Role.Supporter, Role.User)
  @Post()
  create(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    return this.productCategoryService.create(createProductCategoryDto);
  }
  @Roles( Role.Supporter, Role.User)
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
