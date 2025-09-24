import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberListMessageDto } from './create-member-list-message.dto';

export class UpdateMemberListMessageDto extends PartialType(
  CreateMemberListMessageDto,
) {}
