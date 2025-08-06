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
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Action } from 'src/common/dto/structured-array.dto';
import {
  ApiTags,
  ApiQuery,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Roles(Role.Admin, Role.Supporter, Role.User)
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images'))
  
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
     console.log('Files received:', createProductDto);
     if(createProductDto.categoryIds && createProductDto.categoryIds.length === 0) {
       throw new BadRequestException('At least one categoryId must be provided.');
     }
     const { categoryIds, ...restOfProductData } = createProductDto;
    return this.productService.create(createProductDto, files);
  }

  @Roles(Role.Supporter, Role.User)
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

  @Roles(Role.Supporter, Role.User)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Roles(Role.Supporter, Role.User)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FilesInterceptor('newImages'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the product',
    example: '5857257a-7610-470e-ae2f-29a3ca9c06d5',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Updated Product' },
        description: { type: 'string', example: 'Updated description' },
        price: { type: 'number', example: 19.99 },
        draft: { type: 'boolean', example: true },
        categoryIds: {
          type: 'array',
          items: { type: 'string', example: 'category-id:add' },
        },
        color: {
          type: 'array',
          items: { type: 'string', example: 'Red:add' },
        },
        features: {
          type: 'array',
          items: { type: 'string', example: 'Feature 1:add' },
        },
        offerPrice: { type: 'number', example: 15.99 },
        successPage: { type: 'string', enum: ['message', 'redirect'] },
        successPagefield: { type: 'string' },
        images: {
          type: 'array',
          items: { type: 'string', example: 'media-id:remove' },
          description: 'Image string format: value:action',
        },
        newImages: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  update(
  @Param('id') id: string,
  @Body() body: any,
  @UploadedFiles() newImages: Express.Multer.File[],
) {
  const updateProductDto = new UpdateProductDto();
  for (const key in body) {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      if (['images', 'categoryIds', 'color', 'features'].includes(key)) {
          let itemsToProcess: string[] = [];
          if (Array.isArray(body[key])) {
            itemsToProcess = body[key];
          } else if (typeof body[key] === 'string') {
            // Handle comma-separated values, then space-hyphen separated, then single item
            if (body[key].includes(',')) {
              itemsToProcess = body[key].split(',').map((s: string) => s.trim());
            } else if (body[key].includes(' - ')) {
              itemsToProcess = body[key].split(' - ').map((s: string) => s.trim());
            } else {
              itemsToProcess = [body[key].trim()];
            }
          }

          updateProductDto[key] = itemsToProcess
            .filter((item) => item !== '') // Filter out empty strings
            .map((item: string) => {
              const [value, actionString] = item.split(':');
              console.log(`Parsing item: ${item}, Value: ${value}, ActionString: ${actionString}`);
              const action = actionString === 'add' ? Action.ADD : Action.DELETE;
              return { value, action };
            });
        } else if (key === 'price' || key === 'offerPrice') {
          updateProductDto[key] = body[key] === '' ? undefined : parseFloat(body[key]);
        } else if (key === 'draft') {
          updateProductDto[key] = body[key] === 'true';
        } else if (key === 'successPage' || key === 'successPagefield') {
          updateProductDto[key] = body[key] === '' ? undefined : body[key];
        } else {
          updateProductDto[key] = body[key];
        }
      }
    }
    
    return this.productService.update(id, updateProductDto, newImages);
  }

  @Roles(Role.Supporter, Role.User)
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
