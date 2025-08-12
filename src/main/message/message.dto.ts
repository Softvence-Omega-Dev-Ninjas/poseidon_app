import { IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  sender: string;

  @IsUUID()
  receiver: string;

  @IsString()
  text: string;
}
