import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { CreateImageDto } from './create-image.dto';
import { Roles as Visibility } from 'generated/prisma';

export class UpdateImageDto extends PartialType(CreateImageDto) {
  @ApiProperty({
    description: 'Title of the image',
    example: 'Updated Image Title',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Visibility of the image',
    enum: Visibility,
    required: false,
  })
  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Optional new image file to upload',
    required: false,
  })
  @IsOptional()
  newImage?: Express.Multer.File
}
