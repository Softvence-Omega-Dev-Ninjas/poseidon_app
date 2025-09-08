import { PartialType } from '@nestjs/mapped-types';
import {
  CheersLivePackageType,
  CreateSupporterCartLayout,
} from './create-supporter-layout';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SupportCartLayout } from 'generated/prisma';
// import { SupportCartLayoutQuantity } from './supportCartLayoutQuantity.dto';
// import { CreateSupporterDto } from './create-supporter.dto';

// export class UpdateSupporterDto extends PartialType(CreateSupporterDto) {}
export class UpdateSupporterLayputDto extends PartialType(
  CreateSupporterCartLayout,
) {
  @ApiProperty({
    required: true,
    example: '5cde7c60-24ce-4129-a62d-9b591c11bb79',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    required: false,
    example: 'standard',
  })
  @IsString()
  choose_layout: SupportCartLayout;

  @ApiProperty({
    required: false,
    example: 10,
  })
  @IsNumber()
  default_price: number;

  @ApiProperty({
    required: false,
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
  cheers_live_package_type?: CheersLivePackageType[];

  // @ApiProperty({
  //   required: false,
  //   type: () => SupportCartLayoutQuantity,
  //   example: [
  //     {
  //       package_name: 'package name cheers drink',
  //       package_time: 12,
  //       package_price: 20,
  //     },
  //     {
  //       package_name: 'package name cheers drink2',
  //       package_time: 12,
  //       package_price: 20,
  //     },
  //   ],
  // })
  // @IsArray()
  // SuggestQuantity?: SupportCartLayoutQuantity[];
}
