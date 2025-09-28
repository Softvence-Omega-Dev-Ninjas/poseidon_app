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
import {
  CreateServicesDto,
  UpdateServiceOrderStatusDto,
} from './dto/create-services';
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

  // async findAll(page = 1, limit = 10, draft?: boolean) {
  //   const skip = (page - 1) * limit;
  //   const where: any = {};
  //   if (draft !== undefined) where.draft = draft;

  //   const [services, total] = await this.prisma.$transaction([
  //     this.prisma.service.findMany({ where, skip, take: limit }),
  //     this.prisma.service.count({ where }),
  //   ]);

  //   const totalPages = Math.ceil(total / limit);
  //   return cResponseData({
  //     message: 'Services retrieved successfully.',
  //     error: null,
  //     success: true,
  //     data: { total, services, currentPage: page, totalPages, limit },
  //   });
  // }

  async findAll(page = 1, limit = 10, draft?: boolean, userId?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (draft !== undefined) where.draft = draft;
    if (userId) where.userId = userId;

    const [services, total] = await this.prisma.$transaction([
      this.prisma.service.findMany({
        where,
        skip,
        take: limit,
      }),
      this.prisma.service.count({ where }),
    ]);

    const allMediaIds = services.flatMap((s) => s.images);

    const medias = await this.prisma.media.findMany({
      where: { id: { in: allMediaIds } },
    });

    const mediaMap = new Map(medias.map((m) => [m.id, m]));

    const servicesWithMedia = services.map((s) => ({
      ...s,
      media: s.images.map((id) => mediaMap.get(id)).filter(Boolean),
    }));

    const totalPages = Math.ceil(total / limit);
    return cResponseData({
      message: 'Services retrieved successfully.',
      error: null,
      success: true,
      data: {
        total,
        services: servicesWithMedia,
        currentPage: page,
        totalPages,
        limit,
      },
    });
  }

  // async findAllUser(userid: string, page = 1, limit = 10, draft?: boolean) {
  //   const skip = (page - 1) * limit;
  //   const where: any = { userId: userid };
  //   if (draft !== undefined) where.draft = draft;

  //   const [services, total] = await this.prisma.$transaction([
  //     this.prisma.service.findMany({ where, skip, take: limit }),
  //     this.prisma.service.count({ where }),
  //   ]);

  //   const totalPages = Math.ceil(total / limit);
  //   return cResponseData({
  //     message: 'Services retrieved successfully.',
  //     error: null,
  //     success: true,
  //     data: { total, services, currentPage: page, totalPages, limit },
  //   });
  // }

  async findAllUser(userId: string, page = 1, limit = 10, draft?: boolean) {
    const skip = (page - 1) * limit;
    const where: any = { userId };
    if (draft !== undefined) where.draft = draft;

    const [services, total] = await this.prisma.$transaction([
      this.prisma.service.findMany({ where, skip, take: limit }),
      this.prisma.service.count({ where }),
    ]);

    const allMediaIds = services.flatMap((s) => s.images);

    const medias = await this.prisma.media.findMany({
      where: { id: { in: allMediaIds } },
    });

    const mediaMap = new Map(medias.map((m) => [m.id, m]));

    const servicesWithMedia = services.map((s) => ({
      ...s,
      media: s.images.map((id) => mediaMap.get(id)).filter(Boolean),
    }));

    const totalPages = Math.ceil(total / limit);
    return cResponseData({
      message: 'Services retrieved successfully.',
      error: null,
      success: true,
      data: {
        total,
        services: servicesWithMedia,
        currentPage: page,
        totalPages,
        limit,
      },
    });
  }

  // async findOne(id: string) {
  //   const service = await this.prisma.service.findUnique({ where: { id } });
  //   if (!service) throw new NotFoundException(`Service ${id} not found`);

  //   return cResponseData({
  //     message: 'Service retrieved successfully.',
  //     error: null,
  //     success: true,
  //     data: service,
  //   });
  // }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException(`Service ${id} not found`);
    }

    let medias: Awaited<ReturnType<typeof this.prisma.media.findMany>> = [];
    if (Array.isArray(service.images) && service.images.length > 0) {
      medias = await this.prisma.media.findMany({
        where: { id: { in: service.images } },
      });
    }

    return cResponseData({
      message: 'Service retrieved successfully.',
      error: null,
      success: true,
      data: {
        ...service,
        medias,
      },
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

    const orderexite = await this.prisma.serviceOrder.findFirst({
      where: { serviceId: id },
    });

    if (orderexite) {
      throw new BadRequestException(
        'Cannot delete service with existing orders',
      );
    }

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

  async createOrder(dto: CreateServiceOrderDto, userId: string) {
    const service = await this.prisma.service.findFirst({
      where: { id: dto.serviceId },
      include: {
        user: true,
      },
    });
    if (!service || !service.id) {
      return cResponseData({
        message: 'Service not found',
        error: 'NotFound',
        success: false,
        data: null,
      });
    }
    const OderSerderSave = await this.prisma.serviceOrder.create({
      data: {
        paymentDetails: {
          create: {
            amount: service.price,
          },
        },
        userId: userId,
        sellerId: service.userId,
        serviceId: service.id,
      },
      include: {
        paymentDetails: true,
      },
    });

    return OderSerderSave;
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

    const reuslt = {
      total,
      page: Math.floor(skip / take) + 1,
      limit: take,
      data: orders,
    };

    return cResponseData({
      message: 'get all order successfully.',
      error: null,
      success: true,
      data: reuslt,
    });
  }

  /** Get all service orders with optional pagination */
  async findAllOrdeSingleuser(
    userId: string,
    options?: { skip?: number; take?: number },
  ) {
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

    const reuslt = {
      total,
      page: Math.floor(skip / take) + 1,
      limit: take,
      data: orders,
    };

    return cResponseData({
      message: 'get all order successfully.',
      error: null,
      success: true,
      data: reuslt,
    });
  }

  /** Get a single service order by ID */
  async findSingle(id: string, options?: { skip?: number; take?: number }) {
    const { skip = 0, take = 10 } = options || {};

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.serviceOrder.findMany({
        where: { serviceId: id },
        include: {
          service: true,
          user: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.serviceOrder.count({
        where: { serviceId: id },
      }),
    ]);

    if (!orders || orders.length === 0) {
      throw new NotFoundException(
        `ServiceOrder with serviceId ${id} not found`,
      );
    }

    const result = {
      total,
      page: Math.floor(skip / take) + 1,
      limit: take,
      data: orders,
    };
    console.log('hit here for single order');
    return cResponseData({
      message: ' Get a single service order by ID successfully.',
      error: null,
      success: true,
      data: result,
    });
  }

  async updateOrderStatus(orderId: string, dto: UpdateServiceOrderStatusDto) {
    const order = await this.prisma.serviceOrder.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // const data = await this.prisma.serviceOrder.update({
    //   where: { id: orderId },
    //   data: { status: dto.status },
    // });
    return cResponseData({
      message: 'update orderstatus successfully.',
      error: null,
      success: true,
      data: order,
    });
  }

  async getServicesBuyPayemtData(userId: string) {
    const currentTime = new Date();
    const top3cardData = await this.prisma.$transaction(async (tx) => {
      const suportCount = await tx.serviceOrder.count({
        where: {
          sellerId: userId,
          paymentDetails: {
            paymemtStatus: 'pending',
          },
        },
      });
      const newSupport = await tx.serviceOrder.count({
        where: {
          sellerId: userId,
          paymentDetails: {
            paymemtStatus: 'pending',
          },
          createdAt: {
            gte: new Date(currentTime.getFullYear(), currentTime.getMonth(), 1),
            lt: new Date(
              currentTime.getFullYear(),
              currentTime.getMonth() + 1,
              1,
            ),
          },
        },
      });

      const lastMonthTotalAmount = await tx.paymentDetailsByServices.aggregate({
        where: {
          serviceOrderInfo: {
            sellerId: userId,
            paymentDetails: {
              paymemtStatus: 'paid',
            },
            createdAt: {
              gte: new Date(
                currentTime.getFullYear(),
                currentTime.getMonth(),
                1,
              ),
              lt: new Date(
                currentTime.getFullYear(),
                currentTime.getMonth() + 1,
                1,
              ),
            },
          },
        },
        _sum: {
          amount: true,
        },
      });

      const newSupportbuyService = await tx.serviceOrder.findMany({
        where: {
          sellerId: userId,
          paymentDetails: {
            paymemtStatus: 'pending',
          },
          createdAt: {
            gte: new Date(currentTime.getFullYear(), currentTime.getMonth(), 1),
            lt: new Date(
              currentTime.getFullYear(),
              currentTime.getMonth() + 1,
              1,
            ),
          },
        },
        distinct: ['userId'],
        select: {
          userId: true,
        },
      });

      const allDay = await tx.paymentDetailsByServices.aggregate({
        where: {
          serviceOrderInfo: {
            sellerId: userId,
            paymentDetails: {
              paymemtStatus: 'paid',
            },
          },
        },
        _sum: {
          amount: true,
        },
      });

      return {
        supporters: {
          suportCount,
          newSupport,
        },
        last30day: {
          lastMonthTotalAmount: lastMonthTotalAmount._sum.amount
            ? lastMonthTotalAmount._sum.amount
            : 0,
          newSupportbuyService: newSupportbuyService.length,
        },
        allDay: {
          totalAmount: allDay._sum.amount ? allDay._sum.amount : 0,
        },
      };
    });

    const services = await this.prisma.serviceOrder.findMany({
      where: {
        sellerId: userId,
      },
      select: {
        id: true,
        createdAt: true,
        user: {
          select: {
            profile: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        paymentDetails: {
          select: {
            id: true,
            amount: true,
            paymemtStatus: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return cResponseData({
      message: 'get all services successfully.',
      error: null,
      success: true,
      data: {
        ...top3cardData,
        supporterProfile: services,
      },
    });
  }
}
