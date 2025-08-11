import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
  IsBoolean,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

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
  @Transform(({ value }) => value === 'true')
  draft: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  shopId: string;

  @ApiProperty()
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  categoryIds: string[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  color?: string[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  features?: string[];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  offerPrice: number;

  @ApiProperty({ enum: ['message', 'redirect'] })
  @IsIn(['message', 'redirect'])
  @IsNotEmpty()
  successPage: 'message' | 'redirect';

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  successPagefield: string;
}
