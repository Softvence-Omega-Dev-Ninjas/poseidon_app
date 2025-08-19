import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import {
  Action,
  StructuredArrayItemDto,
} from 'src/common/dto/structured-array.dto';
import { sendResponse } from 'src/common/utils/send-response.util';
import { cResponseData } from 'src/common/utils/common-responseData';

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
      throw new BadRequestException(
        'At least one categoryId must be provided.',
      );
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

    const product = await this.prisma.product.create({
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
    return   cResponseData({
    message: 'Product created successfully.',
    error: null,
    success: true,
    data: product,
  });
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

    return cResponseData({
      message: 'Products retrieved successfully.',
      error: null,
      success: true,
      data:data,
    });
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

    return  cResponseData({
       message: 'Products retrieved successfully.',
      error: null,
      success: true,
      data:product
    })
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    newImages: Express.Multer.File[],
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        productCategories: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const { categoryIds, images, color, features, draft, ...productData } =
      updateProductDto;

    const updateData: any = {};

    // Handle simple properties, only if they are not null/undefined
    if (productData.name !== null && productData.name !== undefined) {
      updateData.name = productData.name;
    }
    if (
      productData.description !== null &&
      productData.description !== undefined
    ) {
      updateData.description = productData.description;
    }
    if (
      productData.price !== null &&
      productData.price !== undefined &&
      !isNaN(productData.price)
    ) {
      updateData.price = productData.price;
    }
    if (
      productData.offerPrice !== null &&
      productData.offerPrice !== undefined &&
      !isNaN(productData.offerPrice)
    ) {
      updateData.offerPrice = productData.offerPrice;
    }
    if (draft !== null && draft !== undefined) {
      updateData.draft = draft;
    }
    if (
      productData.successPage !== null &&
      productData.successPage !== undefined
    ) {
      updateData.successPage = productData.successPage;
    }
    if (
      productData.successPagefield !== null &&
      productData.successPagefield !== undefined
    ) {
      updateData.successPagefield = productData.successPagefield;
    }

    // Handle images
    let updatedImages = [...(product.images || [])];
    if (images) {
      for (const item of images) {
        if (item.action === Action.DELETE) {
          const media = await this.prisma.media.findUnique({
            where: { id: item.value },
          });
          if (media) {
            await this.cloudinaryService.deleteFile(media.publicId);
            await this.prisma.media.delete({ where: { id: media.id } });
            updatedImages = updatedImages.filter(
              (imgId) => imgId !== item.value,
            );
          }
        }
      }
    }
    if (newImages && newImages.length > 0) {
      for (const file of newImages) {
        const uploadRes = await this.cloudinaryService.imageUpload(file);
        updatedImages.push(uploadRes.mediaId);
      }
    }
    updateData.images = updatedImages;

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

      // Initialize productCategories in updateData to ensure it's always an object
      // with create and deleteMany properties, even if empty.
      updateData.productCategories = {
        deleteMany: [],
        create: [],
      };

      for (const item of categoryIds) {
        if (item.action === Action.ADD) {
          // Check if the category is already connected to avoid unique constraint violation
          const isAlreadyConnected = product.productCategories.some(
            (pc) => pc.categoryId === item.value,
          );
          if (!isAlreadyConnected) {
            categoriesToConnect.push({ categoryId: item.value });
          }
        } else if (item.action === Action.DELETE) {
          categoriesToDisconnect.push({
            productId: id,
            categoryId: item.value,
          });
        }
      }

      if (categoriesToDisconnect.length > 0) {
        updateData.productCategories.deleteMany = {
          OR: categoriesToDisconnect,
        };
      }
      if (categoriesToConnect.length > 0) {
        const allCategoryIds = categoriesToConnect.map((c) => c.categoryId);
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
        updateData.productCategories.create = categoriesToConnect.map((c) => ({
          category: { connect: { id: c.categoryId } },
        }));
      }
    }
     const data = await this.prisma.product.update({
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
    return cResponseData({
       message: 'Products update successfully.',
      error: null,
      success: true,
      data:data
    })
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
  try {
    const deleted = await this.prisma.product.delete({
      where: { id },
    });

    return cResponseData({
      message: 'Product deleted successfully.',
      error: null,
      success: true,
      data: deleted,
    });
  } catch (error) {
    return cResponseData({
      message: 'Failed to delete product.',
      error: error.message,
      success: false,
      data: null,
    });
  }
}


  async findByShopId(shopId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

     const data = await this.prisma.product.findMany({
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
      return  cResponseData({
        message: 'Product deleted successfully.',
      error: null,
      success: true,
      data: data
      })
}
}