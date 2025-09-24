import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDashboardDto } from './create-user-dashboard.dto';

export class UpdateUserDashboardDto extends PartialType(
  CreateUserDashboardDto,
) {}
