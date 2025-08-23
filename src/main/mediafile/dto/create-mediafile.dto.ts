import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMediafileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsString()
  @IsNotEmpty()
  image: Express.Multer.File;
}

export class DeleteMediaFfileDto {
  @ApiProperty({
    type: String,
    description: 'The ID of the media file to delete',
    example: 'dfhsdf',
  })
  @IsString()
  @IsNotEmpty()
  mid: string;
}
