import {
  IsBoolean,
  IsString,
  IsArray,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { WhoCanSee } from 'generated/prisma';

export class UpdatePostDto {
  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  drafted?: boolean;

  @ApiProperty({ example: 'Updated post text', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: WhoCanSee, required: false })
  @IsOptional()
  @IsEnum(WhoCanSee)
  whoCanSee?: WhoCanSee;

  @ApiProperty({
    type: [String],
    description: 'List of image media IDs to remove',
    example: ['media_id_1', 'media_id_2'],
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value : [value].filter(Boolean),
  )
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'New images to upload',
    required: false,
  })
  @IsOptional()
  newImages?: Express.Multer.File[];
}
