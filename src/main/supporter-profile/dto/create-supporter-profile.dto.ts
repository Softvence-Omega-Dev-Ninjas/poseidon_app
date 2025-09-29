import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSupporterProfileDto {}

export class ProfileCoverImageDto {
  // @ApiProperty({
  //   required: true,
  //   example: '-10 or 10',
  //   description: 'OffsetY for cover image',
  // })
  // @IsString()
  // @IsNotEmpty()
  // offsetY: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsString()
  @IsNotEmpty()
  image: Express.Multer.File;
}
