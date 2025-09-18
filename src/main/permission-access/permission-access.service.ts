import { Injectable } from '@nestjs/common';
import { CreatePermissionAccessDto } from './dto/create-permission-access.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
// import { UpdatePermissionAccessDto } from './dto/update-permission-access.dto';

@Injectable()
export class PermissionAccessService {
  constructor(private readonly prisma: PrismaService) {}
  create(createPermissionAccessDto: CreatePermissionAccessDto) {
    const endtime = createPermissionAccessDto.endDate
      ? new Date(createPermissionAccessDto.endDate)
      : new Date();
    return { message: 'This action adds a new permissionAccess', endtime };
  }
}
