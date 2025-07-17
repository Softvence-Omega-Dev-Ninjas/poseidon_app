import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateShopDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  userId?: string;
}
