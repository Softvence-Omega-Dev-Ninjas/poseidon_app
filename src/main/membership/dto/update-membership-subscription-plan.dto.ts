import { PartialType } from '@nestjs/mapped-types';
import { CreateMembershipSubscriptionPlanDto } from './create-membership-subscription-plan.dto';

export class UpdateMembershipSubscriptionPlanDto extends PartialType(
  CreateMembershipSubscriptionPlanDto,
) {}
