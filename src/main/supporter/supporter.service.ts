import { Injectable } from '@nestjs/common';
import { CreateSupporterPayDto } from './dto/create-supporter.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { UpdateSupporterDto } from './dto/update-supporter.dto';

@Injectable()
export class SupporterService {
  constructor(private readonly prisma: PrismaService) {}

  getSupportCart(profile_id: string) {
    return this.prisma.supporterPay.findMany({
      include: {
        oder_package_name: true,
      },
    });
  }

  async create(createSupporterDto: CreateSupporterPayDto) {
    const { oder_package_name, ...rootData } = createSupporterDto;

    console.log('oder_package_name', oder_package_name);
    console.log('rootData', rootData);
    const newSupporter = await this.prisma.supporterPay.create({
      data: {
        ...rootData,
        oder_package_name: {
          create: {
            ...oder_package_name,
          },
        },
      },
    });
    return newSupporter;
  }
}
