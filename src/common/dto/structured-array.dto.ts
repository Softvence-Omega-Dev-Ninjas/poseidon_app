import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Action {
  ADD = 'add',
  DELETE = 'delete',
}

export class StructuredArrayItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ enum: Action })
  @IsEnum(Action)
  @IsNotEmpty()
  action: Action;
}
