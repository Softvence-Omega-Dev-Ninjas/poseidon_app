import { PartialType } from '@nestjs/swagger';
import { CreateImageDto } from './create-image.dto';
import { IsOptional, IsArray, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Visibility } from 'generated/prisma';

export class UpdateImageDto extends PartialType(CreateImageDto) {
  @ApiProperty({
    type: [String],
    description: 'List of media IDs to remove from the image',
    example: ['media_id_1', 'media_id_2'],
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value].filter(Boolean)))
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ enum: Visibility, required: false })
  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility;
}
