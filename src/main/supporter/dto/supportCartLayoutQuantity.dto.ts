import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SupportCartLayoutQuantity {
  @ApiProperty({
    required: true,
    example: '2ec4e9d3-28b5-457f-9ab8-6a04bf06f892',
  })
  @IsString()
  @IsNotEmpty()
  supportCartLayoutId: string;

  @ApiProperty({
    required: true,
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateDefaultPrice {
  @ApiProperty({
    required: true,
    example: '2ec4e9d3-28b5-457f-9ab8-6a04bf06f892',
  })
  @IsString()
  @IsNotEmpty()
  supportCartLayoutId: string;

  @ApiProperty({
    required: true,
    example: 'one short drink',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: true,
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
