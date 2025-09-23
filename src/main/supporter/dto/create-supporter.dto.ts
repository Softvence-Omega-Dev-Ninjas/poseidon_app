import { ApiProperty } from '@nestjs/swagger';

export class PackageTypePay {
  @ApiProperty({
    required: true,
    example: 'package name cheers drink',
  })
  package_name: string;

  @ApiProperty({
    required: true,
    example: 15,
  })
  package_time: number;

  @ApiProperty({
    required: true,
    example: 25,
  })
  package_price: number;
}

export class CreateSupporterPayDto {
  @ApiProperty({
    required: true,
    example: '5cde7c60-24ce-4129-a62d-9b591c11bb79',
  })
  id: string;

  @ApiProperty({
    required: false,
    type: () => PackageTypePay,
    example: {
      package_name: 'package name cheers drink',
      package_time: 12,
      package_price: 20,
    },
  })
  oder_package_name?: PackageTypePay;

  @ApiProperty({
    required: true,
    example: 25,
  })
  default_price: number;

  @ApiProperty({
    required: true,
    example: 'jhon doe',
  })
  name: string;

  @ApiProperty({
    required: true,
    example: 'usa',
  })
  country: string;

  @ApiProperty({
    required: true,
    example: 'hey, suppoter',
  })
  massage: string;
}
