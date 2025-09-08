import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
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

  @ApiProperty({
    required: true,
    example: 10,
  })
  @IsNumber()
  default_price: number;
}
