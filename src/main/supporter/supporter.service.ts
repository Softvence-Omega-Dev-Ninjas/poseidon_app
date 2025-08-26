import { Injectable } from '@nestjs/common';
import { CreateSupporterPayDto } from './dto/create-supporter.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { SupportCartLayoutQuantity } from './dto/supportCartLayoutQuantity.dto';
// import { UpdateSupporterDto } from './dto/update-supporter.dto';

@Injectable()
export class SupporterService {
  constructor(private readonly prisma: PrismaService) {}

  async createSuggestQuantity(quantityData: SupportCartLayoutQuantity) {
    return await this.prisma.supportCartLayoutQuantity.create({
      data: {
        ...quantityData,
      },
    });
  }

  async deleteSuggestQuantity(id: string) {
    return await this.prisma.supportCartLayoutQuantity.delete({
      where: {
        id,
      },
    });
  }

  async create(createSupporterDto: CreateSupporterPayDto) {
    const { oder_package_name, ...rootData } = createSupporterDto;

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
