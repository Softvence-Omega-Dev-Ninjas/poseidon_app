import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpUserDto {
  // referral
  @ApiProperty({
    required: false,
    example: 'abcd-1234-efgh-5678',
  })
  referralId?: string;

  @ApiProperty({
    type: Boolean,
    required: true,
    example: false,
  })
  skip: boolean;

  @ApiProperty({
    required: true,
    example: 'user or supporter',
  })
  role: string;

  @ApiProperty({
    required: true,
    example: 'user@gmail.com',
  })
  email: string;

  @ApiProperty({
    required: true,
    example: 'User345@#$',
  })
  password: string;

  /// profile
  @ApiProperty({
    required: true,
    example: 'username',
  })
  username: string;

  @ApiProperty({
    required: true,
    example: 'user name',
  })
  name: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsString()
  @IsNotEmpty()
  image: Express.Multer.File;

  @ApiProperty({
    required: false,
    example: 'user description',
  })
  description?: string;

  @ApiProperty({
    required: false,
    example: 'user address',
  })
  address?: string;

  @ApiProperty({
    required: false,
    example: 'user state',
  })
  state?: string;

  @ApiProperty({
    required: false,
    example: 'user city',
  })
  city?: string;

  @ApiProperty({
    required: false,
    example: 'user country',
  })
  country?: string;

  @ApiProperty({
    required: false,
    example: 'user post code',
  })
  postcode?: string;
}
