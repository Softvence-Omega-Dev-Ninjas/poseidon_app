import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, IsEnum } from 'class-validator';
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

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  shopId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  color?: string[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  features?: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  offerPrice: string;

  @ApiProperty({ enum: SuccessPage })
  @IsEnum(SuccessPage)
  @IsNotEmpty()
  successPage: SuccessPage;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  successPagefield: string;
}
