import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
// import { SupportCartLayout } from 'generated/prisma';
// import { SupportCartLayoutQuantity } from './supportCartLayoutQuantity.dto';
// import { CreateSupporterDto } from './create-supporter.dto';

// export class UpdateSupporterDto extends PartialType(CreateSupporterDto) {}
export class UpdateSupporterLayputDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'standard',
  })
  @IsString()
  choose_layout: string;
}

export class UpdateDefaultPrice {
  @ApiProperty({
    required: false,
    example: 'one short drink',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    required: false,
    example: 8,
  })
  @IsNumber()
  @IsOptional()
  price?: number;
}
