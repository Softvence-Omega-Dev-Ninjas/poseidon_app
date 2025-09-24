import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { FindAllProductCategoriesDto } from './dto/find-all-product-categories.dto';
import { ApiTags, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';

import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { cResponseData } from 'src/common/utils/common-responseData';

@ApiTags('ProductCategory')
@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Roles(Role.Supporter, Role.User)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductCategoryDto })
  create(
    @Body() createProductCategoryDto: CreateProductCategoryDto,
    @Req() req:any,
    @UploadedFile() image?: Express.Multer.File,
    
  ) {
    console.log(req?.sub)
    return this.productCategoryService.create(createProductCategoryDto,req?.sub, image);
  }

  @Roles(Role.Supporter, Role.User)
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: FindAllProductCategoriesDto, @Req() req: any) {
    const result = await this.productCategoryService.findAll(query, req?.sub);
    return cResponseData({
      message: 'Product categories fetched successfully.',
      error: null,
      success: true,
      data: { ...result },
    });
  }

  @Roles(Role.Supporter, Role.User)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productCategoryService.findOne(id);
  }

  @Roles(Role.Supporter, Role.User)
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Updated Category Name' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    const updateProductCategoryDto = new UpdateProductCategoryDto();
    if (body.name) {
      updateProductCategoryDto.name = body.name;
    }
    return this.productCategoryService.update(
      id,
      updateProductCategoryDto,
      files,
    );
  }

  @Roles(Role.Supporter, Role.User)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productCategoryService.remove(id);
  }
}
