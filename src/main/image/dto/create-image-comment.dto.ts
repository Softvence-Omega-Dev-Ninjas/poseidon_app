import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateImageCommentDto {
  @ApiProperty({
    example: 'This is a great comment!',
    description: 'Content of the comment',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 'uuid-of-image',
    description: 'ID of the image the comment belongs to',
  })
  @IsString()
  @IsNotEmpty()
  imageId: string;

  @ApiProperty({
    example: 'uuid-of-parent-comment',
    description: 'ID of the parent comment if this is a reply',
    required: false,
  })
  @IsOptional()
  @IsString()
  parentId?: string;
}