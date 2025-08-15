import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateImageCommentDto {
  @ApiProperty({
    description: 'The content of the comment',
    example: 'This is a great comment!',
  })
  @IsString()
  content: string;
}
