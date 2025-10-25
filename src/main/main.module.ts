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
import { AdminDashboardModule } from './dashboard/admin/admin.module';
import { EntertainerModule } from './entertainer/entertainer.module';
import { PayoutModule } from './payout/payout.module';
import { SuppoterModule } from './dashboard/suppoter-dashboard/suppoter-dsahboard.module';
import { ProfileSettingModule } from './profile-setting/profile-setting.module';
import { PermissionModule } from './permission/permission.module';
import { CalendlyModule } from './calendly/calendly.module';
import { VideoCallSchedulHistoryModule } from './video-call-schedul-history/video-call-schedul-history.module';
import { ReportModule } from './report/report.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    ProfileSettingModule,
    UserModule,
    AdminDashboardModule,
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
    EntertainerModule,
    PayoutModule,
    SuppoterModule,
    PermissionModule,
    // appointment group module
    CalendlyModule,
    VideoCallSchedulHistoryModule,
    ReportModule,
    ContactModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class MainModule {}
