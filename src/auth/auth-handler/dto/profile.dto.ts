import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
} from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class ProfileDto {
  @ApiPropertyOptional({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Profile image URL',
    example: 'https://example.com/avatar.png',
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ description: 'Address', example: '123 Main Street' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'State', example: 'California' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ description: 'City', example: 'Los Angeles' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ description: 'Country', example: 'USA' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ description: 'Postcode', example: '90001' })
  @IsString()
  @IsOptional()
  postcode?: string;

  @ApiPropertyOptional({
    description: 'Cover image URL',
    example: 'https://example.com/cover.jpg',
  })
  @IsString()
  @IsOptional()
  cover_image?: string;

  @ApiPropertyOptional({
    description: 'Description or bio',
    example: 'Full-stack developer',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Cover image Y-offset',
    example: '20',
    default: '0',
  })
  @IsString()
  @IsOptional()
  cover_image_offsetY?: string;
}

export class CreateUserProfileDto extends IntersectionType(ProfileDto) {}
export class UpdateUserProfileDto extends IntersectionType(
  PartialType(ProfileDto),
) {}
