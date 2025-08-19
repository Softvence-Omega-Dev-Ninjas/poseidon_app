import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import {
  FindAllProductCategoriesDto,
  ProductCategorySortBy,
} from './dto/find-all-product-categories.dto';
import { Prisma } from 'generated/prisma';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import { cResponseData } from 'src/common/utils/common-responseData';

@Injectable()
export class ProductCategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}


async create(
    createProductCategoryDto: CreateProductCategoryDto,
    file?: Express.Multer.File,
  ): Promise<any> {
    try {
      let imageUrl: string | null = null;

      // Upload image if provided
      if (file) {
        const uploadRes = await this.cloudinaryService.imageUpload(file);
        imageUrl = uploadRes.mediaId
      }

      // Save category to DB
      const newCategory = await this.prisma.productCategory.create({
        data: {
          name: createProductCategoryDto.name,
          image: imageUrl,
        },
      });

      return cResponseData({
        message: 'Product category created successfully.',
        error: null,
        data: newCategory,
        success: true,
      });
    } catch (error) {
      return cResponseData({
        message: 'Failed to create product category.',
        error: error.message,
        data: null,
        success: false,
      });
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
    return  cResponseData({
      message: 'gest single productgetory',
      error: null,
      data: data,
      success: true,
    })
  }

  async update(
    id: string,
    updateProductCategoryDto: UpdateProductCategoryDto,
    files?: Array<Express.Multer.File>,
  ) {
    const category = await this.prisma.productCategory.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Product category with ID ${id} not found`);
    }

    let imageUrl: string | null | undefined = updateProductCategoryDto.image;

    // If a new file is provided, upload it and update the image URL
    if (files && files.length > 0) {
      const uploadedImage = await this.cloudinaryService.imageUpload(files[0]);
      imageUrl = uploadedImage.mediaId;

      // Delete old image if it exists and is different from the new one
      if (category.image && category.image !== imageUrl) {
        const oldMedia = await this.prisma.media.findUnique({
          where: { id: category.image },
        });
        if (oldMedia) {
          await this.cloudinaryService.deleteFile(oldMedia.publicId);
          await this.prisma.media.delete({ where: { id: oldMedia.id } });
        }
      }
    } else if (updateProductCategoryDto.image === null) {
      // If image is explicitly set to null, delete the old image
      if (category.image) {
        const oldMedia = await this.prisma.media.findUnique({
          where: { id: category.image },
        });
        if (oldMedia) {
          await this.cloudinaryService.deleteFile(oldMedia.publicId);
          await this.prisma.media.delete({ where: { id: oldMedia.id } });
        }
      }
      imageUrl = null; // Set image to null in DB
    }

    const dataToUpdate: Prisma.ProductCategoryUpdateInput = {
      name: updateProductCategoryDto.name,
      image: imageUrl,
    };

    const data = await this.prisma.productCategory.update({
      where: { id: id.toString() },
      data: dataToUpdate,
    });
    return cResponseData({
      message: 'update product-category',
      error: null,
      data: data,
      success: true,
    })
  }

  async remove(id: string) {
    const data = await this.prisma.productCategory.delete({
      where: { id: id.toString() },
    });
    return cResponseData({
      message: 'update product-category',
      error: null,
      data: data,
      success: true,
    })
  }
}
