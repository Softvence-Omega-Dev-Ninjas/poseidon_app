import { IsOptional, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum ProductCategorySortBy {
  NEWEST = 'newest',
  NAME = 'name',
}

export class FindAllProductCategoriesDto {
  @ApiProperty({
    example: 1,
    description: 'Page number for pagination',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    example: ProductCategorySortBy.NEWEST,
    enum: ProductCategorySortBy,
    description: 'Sort product categories by',
    required: false,
  })
  @IsOptional()
  @IsEnum(ProductCategorySortBy)
  sortBy?: ProductCategorySortBy = ProductCategorySortBy.NEWEST;
}
