import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Role } from 'src/auth/guard/role.enum';

export class SendMessageDto {
  @IsUUID()
  sender: string;

  @IsUUID()
  receiver: string;

  @IsString()
  text: string;
}

export class GetConversationsDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsEnum(Role, {
    message: `receiverRole must be one of: ${Object.values(Role).join(', ')}`,
  })
  receiverRole?: Role;

  @IsOptional()
  @IsBoolean({ message: 'onlyUnread must be true or false' })
  onlyUnread?: boolean;
}
