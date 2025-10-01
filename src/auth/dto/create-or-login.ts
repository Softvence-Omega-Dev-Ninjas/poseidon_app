import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export const authProviders = ['x', 'facebook', 'google'] as const;
export type AuthProvider = (typeof authProviders)[number];
export const roles = ['admin', 'supporter', 'user'] as const;
export type TRole = (typeof roles)[number];
class CreateLogin {
  @ApiProperty({
    example: authProviders[2], // it could be -> twitter/facebook/google/""
  })
  @IsOptional()
  provider?: AuthProvider;

  @ApiProperty({
    required: true,
    example: roles[1],
  })
  role: TRole;

  @ApiProperty({
    required: true,
    example: 'user@gmail.com',
  })
  email?: string;

  @ApiProperty({
    required: true,
    example: 'User345@#$',
  })
  password?: string;

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

  @ApiProperty({
    type: 'string',
    example: 'https://something.com/something.....',
  })
  @IsString()
  @IsNotEmpty()
  image: string;

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
export class CreateLoginDto extends IntersectionType(
  PartialType(CreateLogin),
) {}

export class RefDto {
  @ApiProperty({
    required: false,
    example: '123456',
  })
  @IsOptional()
  refId?: string;
}
