import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';

import { cResponseData } from 'src/common/utils/common-responseData';
import {
  Action,
  StructuredArrayItemDto,
} from 'src/common/dto/structured-array.dto';
import { CreateServiceOrderDto } from './dto/create-serviesorder';
import { CreateServicesDto } from './dto/create-services';
import { UpdateservicesDto } from './dto/update-serviecs';

@Injectable()
export class ServiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createServiceDto: CreateServicesDto,
    userId: string,
    files?: Express.Multer.File[],
  ) {
    const mediaIds: string[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const uploadRes = await this.cloudinaryService.imageUpload(file);
        mediaIds.push(uploadRes.mediaId);
      }
    }

    const service = await this.prisma.service.create({
      data: {
        ...createServiceDto,
        userId,
        images: mediaIds,
      },
    });

    return cResponseData({
      message: 'Service created successfully.',
      error: null,
      success: true,
      data: service,
    });
  }

  async findAll(page = 1, limit = 10, draft?: boolean) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (draft !== undefined) where.draft = draft;

    const [services, total] = await this.prisma.$transaction([
      this.prisma.service.findMany({ where, skip, take: limit }),
      this.prisma.service.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    return cResponseData({
      message: 'Services retrieved successfully.',
      error: null,
      success: true,
      data: { total, services, currentPage: page, totalPages, limit },
    });
  }

  async findAllUser(userid: string, page = 1, limit = 10, draft?: boolean) {
    const skip = (page - 1) * limit;
    const where: any = { userId: userid };
    if (draft !== undefined) where.draft = draft;

    const [services, total] = await this.prisma.$transaction([
      this.prisma.service.findMany({ where, skip, take: limit }),
      this.prisma.service.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    return cResponseData({
      message: 'Services retrieved successfully.',
      error: null,
      success: true,
      data: { total, services, currentPage: page, totalPages, limit },
    });
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException(`Service ${id} not found`);

    return cResponseData({
      message: 'Service retrieved successfully.',
      error: null,
      success: true,
      data: service,
    });
  }

  async update(
    id: string,
    dto: UpdateservicesDto,
    newFiles?: Express.Multer.File[],
  ) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException(`Service ${id} not found`);

    let images = [...(service.images || [])];
    if (dto.images) {
      for (const item of dto.images as unknown as StructuredArrayItemDto[]) {
        if (item.action === Action.DELETE) {
          images = images.filter((img) => img !== item.value);
        }
      }
    }
    if (newFiles && newFiles.length > 0) {
      for (const file of newFiles) {
        const uploadRes = await this.cloudinaryService.imageUpload(file);
        images.push(uploadRes.mediaId);
      }
    }

    const updatedService = await this.prisma.service.update({
      where: { id },
      data: { ...dto, images },
    });

    return cResponseData({
      message: 'Service updated successfully.',
      error: null,
      success: true,
      data: updatedService,
    });
  }

async remove(id: string) {
  
  const service = await this.prisma.service.findUnique({ where: { id } });

  if (!service) {
    return cResponseData({
      message: 'Service not found',
      error: 'NotFound',
      success: false,
      data: null,
    });
  }

  
  await this.prisma.serviceOrder.deleteMany({
    where: { serviceId: id },
  });

  
  await this.prisma.service.delete({
    where: { id },
  });

  return cResponseData({
    message: 'Service and related service orders deleted successfully',
    error: null,
    success: true,
    data: null,
  });
}


  async createOrder(dto: CreateServiceOrderDto,userId:string) {
    return this.prisma.serviceOrder.create({
      data: {
        paymentId: dto.paymentId,
        serviceId: dto.serviceId,
        userId,
      },
      include: {
        service: true,
        user: true,
      },
    });
  }

  /** Get all service orders with optional pagination */
  async findAllOrder(options?: { skip?: number; take?: number }) {
    const { skip = 0, take = 10 } = options || {};

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.serviceOrder.findMany({
        include: { service: true, user: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.serviceOrder.count(),
    ]);

    return {
      total,
      page: Math.floor(skip / take) + 1,
      limit: take,
      data: orders,
    };
  }


    /** Get all service orders with optional pagination */
async findAllOrdeSingleuser(userId: string, options?: { skip?: number; take?: number }) {
  const { skip = 0, take = 10 } = options || {};

  const [orders, total] = await this.prisma.$transaction([
    this.prisma.serviceOrder.findMany({
      where: {
        service: {
          userId: userId, 
        },
      },
      include: {
        service: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
    }),
    this.prisma.serviceOrder.count({
      where: {
        service: {
          userId: userId, 
        },
      },
    }),
  ]);

  return {
    total,
    page: Math.floor(skip / take) + 1,
    limit: take,
    data: orders,
  };
}

  /** Get a single service order by ID */
  async findSingle(id: string) {
    const order = await this.prisma.serviceOrder.findUnique({
      where: { id },
      include: {
        service: true,
        user: true,
      },
    });

    if (!order)
      throw new NotFoundException(`ServiceOrder with id ${id} not found`);
    return order;
  }
}
