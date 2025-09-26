import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllOrdersDto {
  @ApiProperty({
    required: false,
    default: 1,
    description: 'Page number for pagination',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiProperty({
    required: false,
    default: 10,
    description: 'Number of items per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @ApiProperty({ required: false, description: 'Filter by product price' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price?: number;

  @ApiProperty({ required: false, description: 'Filter by user email' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false, description: 'Filter by user full name' })
  @IsOptional()
  @IsString()
  fullName?: string;
}

export class GetOrderItemWithBerGirl {
  @ApiProperty({
    required: false,
    default: 1,
    description: 'Page number for pagination',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiProperty({
    required: false,
    default: 10,
    description: 'Number of items per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}
