import { PartialType } from '@nestjs/mapped-types';
import { CreateMembershipDto } from './create-membership-Access-plan-details.dto';

export class UpdateMembershipDto extends PartialType(CreateMembershipDto) {}
