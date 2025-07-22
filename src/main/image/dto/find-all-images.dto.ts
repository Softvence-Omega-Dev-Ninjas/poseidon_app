import { IsOptional, IsNumberString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Visibility } from 'generated/prisma';

export enum ImageSortBy {
  NEWEST = 'newest',
  LIKED = 'liked',
  VIEWED = 'viewed',
}

export class FindAllImagesDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiProperty({ required: false, enum: ImageSortBy, default: ImageSortBy.NEWEST })
  @IsOptional()
  @IsEnum(ImageSortBy)
  sortBy?: ImageSortBy;

  @ApiProperty({ required: false, enum: Visibility })
  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility;
}