import { PartialType } from '@nestjs/mapped-types';
import { CreateSupporterProfileDto } from './create-supporter-profile.dto';

export class UpdateSupporterProfileDto extends PartialType(
  CreateSupporterProfileDto,
) {}
