import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsNotEmpty,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SuccessPage } from 'generated/prisma';
import { ApiProperty } from '@nestjs/swagger';
import { StructuredArrayItemDto } from 'src/common/dto/structured-array.dto';

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

  @ApiProperty({ required: false, type: () => [StructuredArrayItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StructuredArrayItemDto)
  @IsOptional()
  images?: StructuredArrayItemDto[];

  @ApiProperty({ required: false, type: () => [StructuredArrayItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StructuredArrayItemDto)
  @IsOptional()
  categoryIds?: StructuredArrayItemDto[];

  @ApiProperty({ required: false, type: () => [StructuredArrayItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StructuredArrayItemDto)
  @IsOptional()
  color?: StructuredArrayItemDto[];

  @ApiProperty({ required: false, type: () => [StructuredArrayItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StructuredArrayItemDto)
  @IsOptional()
  features?: StructuredArrayItemDto[];

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  offerPrice?: number;

  @ApiProperty({ required: false, enum: SuccessPage })
  @IsEnum(SuccessPage)
  @IsOptional()
  successPage?: SuccessPage;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  successPagefield?: string;
}
