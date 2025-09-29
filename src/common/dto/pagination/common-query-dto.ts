import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class CommonQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1; // Default page number

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10; // Default number of items per page

  @IsOptional()
  @IsString()
  search?: string; // For search filters

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.ASC; // Sorting direction

  @IsOptional()
  @IsString()
  sortBy?: string; // Sorting field (e.g., 'name', 'createdAt')
}
