import { Body, Controller, Post } from '@nestjs/common';
import { PermissionAccessService } from './permission-access.service';
import { CreatePermissionAccessDto } from './dto/create-permission-access.dto';
import { Public } from 'src/auth/guard/public.decorator';

@Controller('permission-access')
export class PermissionAccessController {
  constructor(
    private readonly permissionAccessService: PermissionAccessService,
  ) {}

  @Public()
  @Post()
  findAll(@Body() createPermissionAccessDto: CreatePermissionAccessDto) {
    return this.permissionAccessService.create(createPermissionAccessDto);
  }
}
