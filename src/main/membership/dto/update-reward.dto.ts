import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoCallRewardDto } from './create-all-reward.dto';
import {
  CreateMembershipAccessToGalleryDto,
  CreateMembershipAccessToMessagesDto,
  CreateMembershipAccessToPostsDto,
} from './create-membership.dto';

export class UpdateVideoCallRewardDto extends PartialType(
  CreateVideoCallRewardDto,
) {}

export class UpdateMessagesRewardDto extends PartialType(
  CreateMembershipAccessToMessagesDto,
) {}

export class UpdateGalleryRewardDto extends PartialType(
  CreateMembershipAccessToGalleryDto,
) {}

export class UpdatePostsRewardDto extends PartialType(
  CreateMembershipAccessToPostsDto,
) {}
