import { ApiProperty } from '@nestjs/swagger';

export class SignupUserProfileDto {
  @ApiProperty({
    required: true,
    example: 'user name',
  })
  name: string;

  @ApiProperty({
    required: true,
    example: 'user image',
  })
  image: Express.Multer.File;

  @ApiProperty({
    required: false,
    example: 'user description',
  })
  description?: string;

  //   @ApiProperty({
  //     required: false,
  //     example: 'user cover_image with view page',
  //   })
  //   cover_image?: string;

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

export class SignUpUserDto {
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

  @ApiProperty({
    required: false,
    type: () => SignupUserProfileDto,
    example: {
      name: 'John Doe',
      image: 'iamge url',
      description: 'A brief description about the user',
      cover_image: 'cover image url',
      address: '123 Main Street',
      state: 'California',
      city: 'Los Angeles',
      country: 'USA',
      postcode: '90001',
    },
  })
  profile: SignupUserProfileDto;
}
