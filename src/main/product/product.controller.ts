import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Req,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiTags,
  ApiQuery,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';


@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Roles(Role.Admin, Role.Supporter, Role.User)
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        draft: { type: 'boolean' },
        shopId: { type: 'string' },
        categoryIds: { type: 'array', items: { type: 'string' } },
        color: { type: 'array', items: { type: 'string' } },
        features: { type: 'array', items: { type: 'string' } },
        offerPrice: { type: 'number' },
       successPage: {
        type: 'string',
        enum: ['message', 'redirect'],
      },
        successPagefield: { type: 'string' },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    return this.productService.create(createProductDto, files);
  }

  @Roles( Role.Supporter, Role.User)
  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: String,
    description: 'Filter by category ID',
  })
  @ApiQuery({
    name: 'draft',
    required: false,
    type: Boolean,
    description: 'Filter by draft status',
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('categoryId') categoryId?: string,
    @Query('draft') draft?: boolean,
  ) {
    return this.productService.findAll(+page, +limit, categoryId, draft);
  }

  @Roles( Role.Supporter, Role.User)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

   @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images'))
  @ApiBody({
  schema: {
    type: 'object',
    properties: {
      name: { type: 'string', nullable: true },
      description: { type: 'string', nullable: true },
      price: { type: 'number', nullable: true },
      offerPrice: { type: 'number', nullable: true },
      draft: { type: 'boolean', nullable: true },
      shopId: { type: 'string', nullable: true },
      successPage: {
        type: 'string',
        enum: ['message', 'redirect'],
        nullable: true,
      },
      successPagefield: { type: 'string', nullable: true },

      // Arrays of objects with value and action
      images: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            value: { type: 'string' }, // Could be a media URL or ID
            action: { type: 'string', enum: ['add', 'remove'] },
          },
        },
        nullable: true,
      },
      categoryIds: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            value: { type: 'string' },
            action: { type: 'string', enum: ['add', 'remove'] },
          },
        },
        nullable: true,
      },
      color: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            value: { type: 'string' },
            action: { type: 'string', enum: ['add', 'remove'] },
          },
        },
        nullable: true,
      },
      features: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            value: { type: 'string' },
            action: { type: 'string', enum: ['add', 'remove'] },
          },
        },
        nullable: true,
      },
    },
  },
})

@Patch(':id')
  @Roles(Role.Supporter, Role.User)
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', nullable: true },
        description: { type: 'string', nullable: true },
        price: { type: 'number', nullable: true },
        offerPrice: { type: 'number', nullable: true },
        draft: { type: 'boolean', nullable: true },
        shopId: { type: 'string', nullable: true },
        successPage: {
          type: 'string',
          enum: ['message', 'redirect'],
          nullable: true,
        },
        successPagefield: { type: 'string', nullable: true },

        images: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string' },
              action: { type: 'string', enum: ['add', 'remove'] },
            },
          },
          nullable: true,
        },
        categoryIds: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string' },
              action: { type: 'string', enum: ['add', 'remove'] },
            },
          },
          nullable: true,
        },
        color: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string' },
              action: { type: 'string', enum: ['add', 'remove'] },
            },
          },
          nullable: true,
        },
        features: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string' },
              action: { type: 'string', enum: ['add', 'remove'] },
            },
          },
          nullable: true,
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }
 @Roles( Role.Supporter, Role.User)
  @Get('shop/:shopId')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  findByShopId(
    @Param('shopId') shopId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.productService.findByShopId(shopId, +page, +limit);
  }
}
