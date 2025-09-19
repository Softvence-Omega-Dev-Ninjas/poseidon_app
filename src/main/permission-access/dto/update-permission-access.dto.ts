import { PartialType } from '@nestjs/mapped-types';
import { AccesPermissionAccessDto } from './create-permission-access.dto';

export class UpdatePermissionAccessDto extends PartialType(
  AccesPermissionAccessDto,
) {}
