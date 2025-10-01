import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { CreateImageDto } from './create-image.dto';
import { Visibility } from 'generated/prisma';

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
  // @Transform(({ value }: { value: string }) => {
  //   if (!value || value === '--') return undefined;
  //   return value.toLowerCase();
  // })
  visibility?: Visibility;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Optional image file to upload',
    required: false,
  })
  @IsOptional()
  image?: Express.Multer.File;
}
