import { ApiProperty } from '@nestjs/swagger';
import { LayoutType } from '@prisma/client';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CheersLivePackageType {
  @ApiProperty({
    required: true,
    example: 'package name cheers drink',
  })
  @IsString()
  @IsNotEmpty()
  package_name: string;

  @ApiProperty({
    required: true,
    example: 15,
  })
  @IsNumber()
  @IsNotEmpty()
  package_time: number;

  @ApiProperty({
    required: true,
    example: 25,
  })
  @IsNumber()
  @IsNotEmpty()
  package_price: number;
}

export class CreateSupporterCartLayout {
  @ApiProperty({
    required: true,
    example: '5cde7c60-24ce-4129-a62d-9b591c11bb79',
  })
  @IsString()
  @IsNotEmpty()
  author_id: string;

  @ApiProperty({
    required: true,
    example: 'standard',
  })
  @IsString()
  @IsNotEmpty()
  choose_layout: LayoutType;

  @ApiProperty({
    required: true,
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  default_price: number;

  @ApiProperty({
    required: true,
    type: () => CheersLivePackageType,
    example: [
      {
        package_name: 'package name cheers drink',
        package_time: 12,
        package_price: 20,
      },
      {
        package_name: 'package name cheers drink2',
        package_time: 12,
        package_price: 20,
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  cheers_live_package_type: CheersLivePackageType[];
}
