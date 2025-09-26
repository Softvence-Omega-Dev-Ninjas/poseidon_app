import { Module } from '@nestjs/common';
import { PermissionAccessService } from './permission-access.service';
import { PermissionAccessController } from './permission-access.controller';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';

@Module({
  imports: [PrismaClientModule],
  controllers: [PermissionAccessController],
  providers: [PermissionAccessService],
})
export class PermissionAccessModule {}
