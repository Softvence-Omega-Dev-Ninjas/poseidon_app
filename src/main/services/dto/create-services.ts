import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateServicesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  serviceName : string;

  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @ApiProperty({
    example: false,
    description: 'Whether the product is a draft',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true' || value === true)
  draft: boolean;




  @ApiProperty({ enum: ['message', 'redirect'] })
  @IsIn(['message', 'redirect'])
  @IsNotEmpty()
  success: 'message' | 'redirect';

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  successPage: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: false,
  })
  images?: Express.Multer.File[];
}
