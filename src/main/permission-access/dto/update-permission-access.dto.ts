import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionAccessDto } from './create-permission-access.dto';

export class UpdatePermissionAccessDto extends PartialType(CreatePermissionAccessDto) {}
