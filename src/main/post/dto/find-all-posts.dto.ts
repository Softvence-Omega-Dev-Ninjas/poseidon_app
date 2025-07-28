import { IsOptional, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { WhoCanSee } from 'generated/prisma';


export enum PostSortBy {
  VIEWED = 'viewed',
  LIKED = 'liked',
  NEWEST = 'newest',
}

export class FindAllPostsDto {
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
    example: PostSortBy.NEWEST,
    enum: PostSortBy,
    description: 'Sort posts by',
    required: false,
  })
  @IsOptional()
  @IsEnum(PostSortBy)
  sortBy?: PostSortBy = PostSortBy.NEWEST;

  @ApiProperty({
    example: WhoCanSee.PUBLIC,
    enum: WhoCanSee,
    description: 'Filter posts by who can see them',
    required: false,
  })
  @IsOptional()
  @IsEnum(WhoCanSee)
  whoCanSee?: WhoCanSee;
}
