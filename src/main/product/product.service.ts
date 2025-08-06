import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import {
  Action,
  StructuredArrayItemDto,
} from 'src/common/dto/structured-array.dto';
import { sendResponse } from 'src/common/utils/send-response.util';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    files?: Array<Express.Multer.File>,
  ) {
    const { categoryIds, ...restOfProductData } = createProductDto;
    
    const shop = await this.prisma.shop.findFirst({
      where: { id: createProductDto.shopId },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    if (!categoryIds || categoryIds.length === 0) {
    throw new BadRequestException('At least one categoryId must be provided.');
  }

    const mediaIds: string[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const uploadRes = await this.cloudinaryService.imageUpload(file);
        mediaIds.push(uploadRes.mediaId);
      }
    }

    if (categoryIds && categoryIds.length > 0) {
      const existingCategories = await this.prisma.productCategory.findMany({
        where: {
          id: { in: categoryIds },
        },
      });

      if (existingCategories.length !== categoryIds.length) {
        throw new NotFoundException(
          'One or more product categories not found.',
        );
      }
    }


   
    const  product = await this.prisma.product.create({
      data: {
        ...restOfProductData,
        images: mediaIds,
        productCategories: {
          create: categoryIds.map((categoryId: string) => ({
            category: {
              connect: {
                id: categoryId,
              },
            },
          })),
        },
      },
      include: {
        productCategories: {
          include: {
            category: true,
          },
        },
      },
    });
    return sendResponse('Product created successfully', product, 201);
  }

  async findAll(
    page: number,
    limit: number,
    categoryId?: string,
    draft?: boolean,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (categoryId) {
      where.productCategories = {
        some: {
          categoryId: categoryId,
        },
      };
    }

    if (draft !== undefined) {
      where.draft = String(draft).toLowerCase() === 'true';
    }

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          productCategories: {
            include: {
              category: true,
            },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const data = {
      total,
      products,
      currentPage: page,
      limit,
      totalPages,
    };

    return sendResponse('Products retrieved successfully', data, 200); 
  }

  async findOne(id: string) {
  const product = await this.prisma.product.findUnique({
    where: { id },
    include: {
      productCategories: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!product) {
    throw new NotFoundException(`Product with ID ${id} not found`);
  }

  return sendResponse('Product retrieved successfully', product, 200);
}

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { categoryIds, images, color, features, ...productData } =
      updateProductDto;

    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        productCategories: true, // Include existing categories for processing
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const updateData: any = { ...productData };

    // Handle images
    if (images) {
      const currentImages = product.images || [];
      const newImages = this.processStructuredArray(currentImages, images);
      updateData.images = newImages;
    }

    // Handle color
    if (color) {
      const currentColor = product.color || [];
      const newColor = this.processStructuredArray(currentColor, color);
      updateData.color = newColor;
    }

    // Handle features
    if (features) {
      const currentFeatures = product.features || [];
      const newFeatures = this.processStructuredArray(
        currentFeatures,
        features,
      );
      updateData.features = newFeatures;
    }

    // Handle categoryIds
    if (categoryIds) {
      const categoriesToConnect: { categoryId: string }[] = [];
      const categoriesToDisconnect: {
        productId: string;
        categoryId: string;
      }[] = [];

      for (const item of categoryIds) {
        if (item.action === Action.ADD) {
          categoriesToConnect.push({ categoryId: item.value });
        } else if (item.action === Action.DELETE) {
          categoriesToDisconnect.push({
            productId: id,
            categoryId: item.value,
          });
        }
      }

      // Validate if all categories to connect exist
      const allCategoryIds = categoriesToConnect.map((c) => c.categoryId);
      if (allCategoryIds.length > 0) {
        const existingCategories = await this.prisma.productCategory.findMany({
          where: {
            id: { in: allCategoryIds },
          },
        });

        if (existingCategories.length !== allCategoryIds.length) {
          throw new NotFoundException(
            'One or more product categories not found.',
          );
        }
      }

      updateData.productCategories = {
        deleteMany:
          categoriesToDisconnect.length > 0
            ? { OR: categoriesToDisconnect }
            : undefined,
        create:
          categoriesToConnect.length > 0
            ? categoriesToConnect.map((c) => ({
                category: { connect: { id: c.categoryId } },
              }))
            : undefined,
      };
    }

    return await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        productCategories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  private processStructuredArray(
    currentArray: string[],
    updates: StructuredArrayItemDto[],
  ): string[] {
    let newArray = [...currentArray];

    for (const item of updates) {
      if (item.action === Action.ADD) {
        if (!newArray.includes(item.value)) {
          newArray.push(item.value);
        }
      } else if (item.action === Action.DELETE) {
        newArray = newArray.filter((val) => val !== item.value);
      }
    }
    return newArray;
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
      include: {
        productCategories: {
          include: {
            category: true,
          },
        },
      },
    });
  }
}
