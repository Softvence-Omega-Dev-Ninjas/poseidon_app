import { IsOptional, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Visibility } from 'generated/prisma';

export enum ImageSortBy {
  VIEWED = 'viewed',
  LIKED = 'liked',
  NEWEST = 'newest',
}

export class FindAllImagesDto {
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
    example: ImageSortBy.NEWEST,
    enum: ImageSortBy,
    description: 'Sort images by',
    required: false,
  })
  @IsOptional()
  @IsEnum(ImageSortBy)
  sortBy?: ImageSortBy = ImageSortBy.NEWEST;

  @ApiProperty({
    example: Visibility.PUBLIC,
    enum: Visibility,
    description: 'Filter images by visibility',
    required: false,
  })
  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility;

  @ApiPropertyOptional({
    description: 'Filter by provider ID',
    type: String,
  })
  providerId?: string;
}
