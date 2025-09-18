import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { SupporterModule } from './supporter/supporter.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { PostModule } from './post/post.module';
import { ImageModule } from './image/image.module';
import { SupporterProfileModule } from './supporter-profile/supporter-profile.module';
import { MembershipModule } from './membership/membership.module';
import { ChatModule } from './message/message.module';
import { MediafileModule } from './mediafile/mediafile.module';
import { ServicesModule } from './services/services.module';
import { ZoomModule } from './zoom/zoom.module';
import { PaymentModule } from './payment/payment.module';
import { UserDashboardModule } from './dashboard/user-dashboard/user-dashboard.module';
import { PermissionAccessModule } from './permission-access/permission-access.module';

@Module({
  imports: [
    UserModule,
    UserDashboardModule,
    SupporterProfileModule,
    SupporterModule,
    MembershipModule,
    MediafileModule,
    OrderModule,
    ProductModule,
    ProductCategoryModule,
    PostModule,
    ImageModule,
    ChatModule,
    ServicesModule,
    ZoomModule,
    PaymentModule,
    PermissionAccessModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class MainModule {}
