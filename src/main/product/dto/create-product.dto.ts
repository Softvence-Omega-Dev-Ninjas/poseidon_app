import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

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
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @ApiProperty({
    example: false,
    description: 'Whether the product is a draft',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true' || value === true)
  draft: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  shopId: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        // Try to parse as JSON array
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        // If not JSON, split by comma
        return value
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item);
      }
    }
    return [];
  })
  categoryIds: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        return value
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item);
      }
    }
    return [];
  })
  color?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        return value
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item);
      }
    }
    return [];
  })
  features?: string[];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  offerPrice: number;

  @ApiProperty({ enum: ['message', 'redirect'] })
  @IsIn(['message', 'redirect'])
  @IsNotEmpty()
  successPage: 'message' | 'redirect';

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  successPagefield: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: false,
  })
  images?: Express.Multer.File[];
}
