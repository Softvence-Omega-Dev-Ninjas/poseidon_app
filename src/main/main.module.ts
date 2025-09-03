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
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    UserModule,
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
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class MainModule {}
