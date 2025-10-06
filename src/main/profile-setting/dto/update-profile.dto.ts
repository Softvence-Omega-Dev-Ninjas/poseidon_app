import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    type: 'string',
    example: 'John Doe',
    description: 'Optional name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    type: 'string',
    example: '123 Main St, Anytown, USA',
    description: 'Optional country',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    type: 'string',
    example: 'Description',
    description: 'Optional description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Optional product image',
  })
  @IsOptional()
  image?: Express.Multer.File;
}
