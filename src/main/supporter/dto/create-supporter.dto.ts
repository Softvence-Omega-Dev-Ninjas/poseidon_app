import { ApiProperty } from '@nestjs/swagger';

export class CreateSupporterDto {}

export class PackageTypePay {
  @ApiProperty({
    required: true,
    example: 'package name',
  })
  package_name: string;

  @ApiProperty({
    required: true,
    example: 15,
  })
  package_time: number;

  @ApiProperty({
    required: true,
    example: 15,
  })
  package_price: number;
}

export class CreateSupporterPayDto {}
