import {
  ApiHideProperty,
  ApiProperty,
  IntersectionType,
  PartialType,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ProfileDto } from '../auth-handler/dto/profile.dto';
import { Type } from 'class-transformer';

export const authProviders = ['x', 'facebook', 'google', 'tiktok'] as const;
export type AuthProvider = (typeof authProviders)[number];
export const roles = ['admin', 'supporter', 'user'] as const;
export type TRole = (typeof roles)[number];
class CreateLogin {
  @ApiHideProperty()
  username?: string;

  @ApiProperty({
    example: authProviders[2], // it could be -> twitter/facebook/google/""
  })
  @IsOptional()
  provider?: AuthProvider;

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

  @ApiProperty({
    required: true,
    example: roles[1],
  })
  role: TRole;

  @ApiProperty({
    description: 'profile information',
    type: ProfileDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProfileDto)
  profile: ProfileDto;
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
