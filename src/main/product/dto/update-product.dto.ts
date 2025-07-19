import { IsString, IsOptional, IsNumber, IsArray, IsNotEmpty, IsEnum } from 'class-validator';
import { SuccessPage } from 'generated/prisma';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ required: false })
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

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  offerPrice?: string;

  @ApiProperty({ required: false, enum: SuccessPage })
  @IsEnum(SuccessPage)
  @IsOptional()
  successPage?: SuccessPage;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  successPagefield?: string;
}
