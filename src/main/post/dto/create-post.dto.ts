import { IsBoolean, IsString, IsArray, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WhoCanSee } from 'generated/prisma';

export class CreatePostDto {
  @ApiProperty({ example: true, description: 'Whether the post is drafted' })
  @IsBoolean()
  drafted: boolean;

  @ApiProperty({ example: 'This is a great post!', description: 'Description of the post' })
  @IsString()
  description: string;

  @ApiProperty({ example: ['url1', 'url2'], description: 'Array of image URLs', type: [String] })
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty({ example: WhoCanSee.PUBLIC, enum: WhoCanSee, description: 'Who can see the post' })
  @IsEnum(WhoCanSee)
  whoCanSee: WhoCanSee;

  @ApiProperty({ example: 'uuid-of-user', description: 'ID of the post author' })
  @IsString()
  authorId: string;
}
