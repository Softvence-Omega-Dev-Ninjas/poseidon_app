import { PartialType } from '@nestjs/swagger';
import { CreateImageDto } from './create-image.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Visibility } from 'generated/prisma';

export class UpdateImageDto extends PartialType(CreateImageDto) {
  @ApiProperty({ enum: Visibility, required: false })
  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility;
}
