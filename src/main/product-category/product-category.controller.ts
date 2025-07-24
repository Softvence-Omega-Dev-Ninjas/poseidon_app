import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { FindAllProductCategoriesDto } from './dto/find-all-product-categories.dto';
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
  async findAll(@Query() query: FindAllProductCategoriesDto) {
    const result = await this.productCategoryService.findAll(query);
    return {
      message: "Product categories retrieved successfully.",
      data: result.data,
      total: result.total,
      currentPage: result.currentPage,
      limit: result.limit,
      totalPages: result.totalPages,
      statusCode: 200,
      redirect_url: null,
      error: null,
      success: true,
    };
  }

  @Roles( Role.Supporter, Role.User)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productCategoryService.findOne(id);
  }

  @Roles( Role.Supporter, Role.User)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductCategoryDto: UpdateProductCategoryDto) {
    return this.productCategoryService.update(id, updateProductCategoryDto);
  }
  
  @Roles( Role.Supporter, Role.User)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productCategoryService.remove(id);
  }
}
