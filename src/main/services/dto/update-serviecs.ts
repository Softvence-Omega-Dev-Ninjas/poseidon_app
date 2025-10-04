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
import { ApiProperty } from '@nestjs/swagger';
import { StructuredArrayItemDto } from 'src/common/dto/structured-array.dto';
import { SuccessPage } from '@prisma/client';

export class UpdateservicesDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  serviceName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  draft?: boolean;

  @ApiProperty({ required: false })
  @Transform(({ value }) =>
    value === '' || value === null || value === undefined
      ? undefined
      : parseFloat(value),
  )
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ required: false, type: () => [StructuredArrayItemDto] })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return undefined;
      }
    }
    return value;
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StructuredArrayItemDto)
  @IsOptional()
  images?: StructuredArrayItemDto[];

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
  success?: SuccessPage;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  successPage?: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: false,
  })
  newImages?: Express.Multer.File[];
}
