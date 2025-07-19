import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { SupporterModule } from './supporter/supporter.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';


@Module({
  imports: [UserModule, SupporterModule, OrderModule, ProductModule, ProductCategoryModule, PostModule, CommentModule, LikeModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class MainModule {}
