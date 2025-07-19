import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'This is a great comment!', description: 'Content of the comment' })
  @IsString()
  content: string;

  @ApiProperty({ example: 'uuid-of-post', description: 'ID of the post the comment belongs to' })
  @IsString()
  postId: string;

  @ApiProperty({ example: 'uuid-of-user', description: 'ID of the user who created the comment' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'uuid-of-parent-comment', description: 'ID of the parent comment if this is a reply', required: false })
  @IsOptional()
  @IsString()
  parentCommentId?: string;
}
