import {
  IsBoolean,
  IsString,
  IsArray,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { WhoCanSee } from 'generated/prisma';

export class CreatePostDto {
  @ApiProperty({ example: true, description: 'Whether the post is drafted' })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  drafted: boolean;

  @ApiProperty({
    example: 'This is a great post!',
    description: 'Description of the post',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: ['url1', 'url2'],
    description: 'Array of image URLs (optional if uploading files)',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [value];
      }
    }
    return value;
  })
  images?: string[];

  @ApiProperty({
    example: WhoCanSee.PUBLIC,
    enum: WhoCanSee,
    description: 'Who can see the post',
  })
  @IsEnum(WhoCanSee)
  whoCanSee: WhoCanSee;
}
