import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: 'The content of the comment', example: 'This is a great comment!' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'The ID of the parent comment if this is a reply', required: false, example: '5857257a-7610-470e-ae2f-29a3ca9c06d5' })
  @IsOptional()
  @IsString()
  parentId?: string;
}
