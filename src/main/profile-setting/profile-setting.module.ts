import { Module } from '@nestjs/common';
import { ProfileSettingService } from './profile-setting.service';
import { ProfileSettingController } from './profile-setting.controller';
import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';

@Module({
  imports: [PrismaClientModule, CloudinaryModule],
  controllers: [ProfileSettingController],
  providers: [ProfileSettingService],
})
export class ProfileSettingModule {}
