import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { SupporterModule } from './supporter/supporter.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { ShopModule } from './shop/shop.module';

@Module({
  imports: [UserModule, SupporterModule, OrderModule, ProductModule, ProductCategoryModule, ShopModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class MainModule {}
