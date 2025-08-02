import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class GetShopDataService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllShopData(shop_id: string) {
    // This method would contain logic to retrieve all shop data.
    // For now, it returns a placeholder object.
    const shopData = await this.prisma.product.findMany({
      where: { shopId: shop_id },
    });
    return shopData;
  }

  async getFindOne(id: string) {
    return await this.prisma.product.findUnique({
      where: { id },
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
