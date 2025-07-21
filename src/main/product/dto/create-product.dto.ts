import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { SuccessPage } from 'generated/prisma';
import { ApiProperty } from '@nestjs/swagger';

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
  price: number;

  @ApiProperty({
    example: false,
    description: 'Whether the product is a draft',
  })
  @IsBoolean()
  @IsNotEmpty()
  draft: boolean;

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  shopId: string;

  @ApiProperty()
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  categoryIds: string[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  color?: string[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  features?: string[];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  offerPrice: number;

  @ApiProperty({ enum: SuccessPage })
  @IsEnum(SuccessPage)
  @IsNotEmpty()
  successPage: SuccessPage;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  successPagefield: string;
}
