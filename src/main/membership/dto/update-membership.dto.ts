import { PartialType } from '@nestjs/mapped-types';
import { CreateMembershipDto } from './create-membership-plan-details.dto';

export class UpdateMembershipDto extends PartialType(CreateMembershipDto) {}
