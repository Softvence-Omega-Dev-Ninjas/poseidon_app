import {
  IsBoolean,
  IsString,
  IsArray,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { WhoCanSee } from '@prisma/client';

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
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
    description: 'Optional images to upload',
  })
  images?: Express.Multer.File[];

  @ApiProperty({
    example: WhoCanSee.PUBLIC,
    enum: WhoCanSee,
    description: 'Who can see the post',
  })
  @IsEnum(WhoCanSee)
  whoCanSee: WhoCanSee;
}
