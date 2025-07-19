import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { SupporterModule } from './supporter/supporter.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { ProductCategoryModule } from './product-category/product-category.module';


@Module({
  imports: [UserModule, SupporterModule, OrderModule, ProductModule, ProductCategoryModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class MainModule {}
