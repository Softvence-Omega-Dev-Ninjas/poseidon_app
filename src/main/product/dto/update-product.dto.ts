import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsEnum,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
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
  @IsBoolean()
  @IsOptional()
  draft?: boolean;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === null || value === undefined
      ? undefined
      : parseFloat(value),
  )
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
  @Transform(({ value }) =>
    value === '' || value === null || value === undefined
      ? undefined
      : parseFloat(value),
  )
  offerPrice?: number;

  @ApiProperty({ required: false, enum: SuccessPage })
  @IsEnum(SuccessPage)
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      if (value === 'message') return SuccessPage.message;
      if (value === 'redirect') return SuccessPage.redirect;
    }
    return undefined;
  })
  successPage?: SuccessPage;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  successPagefield?: string;
}
