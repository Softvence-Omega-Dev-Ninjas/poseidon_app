import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoCallRewardDto } from './create-all-reward.dto';

export class UpdateVideoCallRewardDto extends PartialType(
  CreateVideoCallRewardDto,
) {}
