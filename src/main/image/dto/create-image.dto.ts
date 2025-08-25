import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Roles as Visibility } from 'generated/prisma';

export class CreateImageDto {
  @ApiProperty({
    example: 'My Awesome Image',
    description: 'Title of the image',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: Visibility.supporter,
    enum: Visibility,
    description: 'Visibility of the image (PUBLIC, SUPPORTERS)',
  })
  @IsEnum(Visibility)
  @IsNotEmpty()
  visibility: Visibility;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Array of image files to upload',
  })
  image: Express.Multer.File;
}
