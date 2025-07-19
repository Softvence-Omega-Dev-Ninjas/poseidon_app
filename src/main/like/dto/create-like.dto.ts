import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLikeDto {
  @ApiProperty({ example: 'uuid-of-user', description: 'ID of the user who liked the post' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'uuid-of-post', description: 'ID of the post being liked' })
  @IsString()
  postId: string;
}
