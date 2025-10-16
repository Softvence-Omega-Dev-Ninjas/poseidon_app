import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

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
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, {
    message: 'Invalid email format',
  })
  email: string;

  @ApiProperty({
    required: true,
    example: 'User345@#$',
  })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @Matches(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|:;"'<>,.?/~`]).{6,}$/,
    {
      message:
        'Password must be 6-15 characters long, include at least 1 uppercase letter, 1 number, and 1 special character',
    },
  )
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
  // @IsString()
  // @IsNotEmpty()
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
