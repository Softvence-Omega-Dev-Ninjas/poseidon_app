import {
  IsBoolean,
  IsString,
  IsArray,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { WhoCanSee } from 'generated/prisma';

class ImageActionDto {
  @ApiProperty({ example: 'https://image.jpg' })
  @IsString()
  value: string;

  @ApiProperty({ example: 'add', enum: ['add', 'remove'] })
  @IsIn(['add', 'remove'])
  action: 'add' | 'remove';
}

export class UpdatePostDto {
  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  drafted?: boolean;

  @ApiProperty({ example: 'Updated post!', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Who can see the post',
    enum: WhoCanSee,
    required: false,
  })
  @IsOptional()
  @IsEnum(WhoCanSee)
  whoCanSee?: WhoCanSee;

  @ApiProperty({
    description: 'JSON string for images with action (add/remove)',
    example: `[{"value":"url1","action":"add"}]`,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      return [];
    }
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageActionDto)
  images?: ImageActionDto[];
}
