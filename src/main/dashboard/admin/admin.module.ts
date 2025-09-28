import { Module } from '@nestjs/common';
import { UserModule } from 'src/main/user/user.module';
import { AdminController } from './admin.controller';
import { AdminOverviewService } from './services/overview.service';
import { AdminBarStarService } from './services/bar-stars.service';
import { GeneralUserService } from './services/general-user.service';

@Module({
  imports: [UserModule],
  controllers: [AdminController],
  providers: [AdminOverviewService, AdminBarStarService, GeneralUserService],
  exports: [],
})
export class AdminDashboardModule {}
