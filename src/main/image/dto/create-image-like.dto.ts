import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateImageLikeDto {
  @ApiProperty({
    example: 'uuid-of-image',
    description: 'ID of the image the like belongs to',
  })
  @IsString()
  @IsNotEmpty()
  imageId: string;
}