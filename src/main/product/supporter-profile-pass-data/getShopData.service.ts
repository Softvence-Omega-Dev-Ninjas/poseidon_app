import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class GetShopDataService {
  constructor(private readonly prisma: PrismaService) {}

  getAllShopData(shop_id: string) {
    // This method would contain logic to retrieve all shop data.
    // For now, it returns a placeholder object.
    const shopData = this.prisma.product.findMany({
      where: { shopId: shop_id },
    });
    return shopData;
  }
}
